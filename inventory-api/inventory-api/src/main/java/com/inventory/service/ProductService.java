package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.entity.Product;
import com.inventory.entity.RawMaterial;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.RawMaterialRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductService(ProductRepository repository,
                          RawMaterialRepository rawMaterialRepository) {
        this.repository = repository;
        this.rawMaterialRepository = rawMaterialRepository;

    }

    // 🚀 @Transactional garante que TODAS as sub-operações em Collections e Banco
    // de Dados aconteçam dentro em uma única "Sessão". Se algo falhar no meio, ele dá
    // Rollback automático em tudo.
    @Transactional
    public ProductDTO save(Product product) {
        // 🛡️ ESTUDO: Validação de Regra de Negócio
        // Impedimos que um produto seja salvo sem pelo menos 1 ingrediente.
        // Se a lista estiver vazia, lançamos um erro 400 (Bad Request).
        if (product.getCompositions() == null || product.getCompositions().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O produto deve possuir pelo menos um ingrediente na composição.");
        }

        // 🔗 Para garantir o Vínculo Bidirecional do Hibernate (onde o Filho precisa
        // conhecer o seu Pai)
        // Precisamos iterar sobre a lista recebida do Front-end antes de persistir
        product.getCompositions().forEach(comp -> {

            // BUSCA O RAW MATERIAL REAL DO BANCO AO SALVAR
            // Como o Front enviou apenas { id: 22 }, buscamos do banco o Leite Líquido
            // completo para o Hibernate trabalhar
            RawMaterial realRawMaterial = rawMaterialRepository
                    .findById(comp.getRawMaterial().getId())
                    .orElseThrow(() -> new RuntimeException("Raw material not found"));

            comp.setRawMaterial(realRawMaterial);
            // PERSISTE A UNIDADE DA RECEITA (G, ML, UN)
            comp.setMeasure(comp.getMeasure());
            // 🧱 O Filho aponta pro Pai! Essencial para o parâmetro mappedBy = "product" da
            // anotação @OneToMany funcionar!
            comp.setProduct(product);
        });

        // 💾 Salva o Produto. Por causa do "cascade = CascadeType.ALL" do mapeamento da
        // Entity,
        // o Hibernate vai identificar os filhos "novos/transientes" que acabaram de ser
        // anexados e gerar as queries de INSERT deles por tabela.
        Product saved = repository.save(product);

        // Generates custom automatic code = User-friendly code without using the ID =
        // dev
        String generatedCode = "Prod" + String.format("%03d", saved.getId());
        saved.setCode(generatedCode);

        // Salvar novamente apenas fará o UPDATE da coluna do CÓDIGO
        repository.save(saved);

        // reaproveita método que já monta DTO corretamente (isso garante que o Front
        // receba o ProductDTO formatado completinho após salvar)
        return findByIdWithCompositions(saved.getId());
    }

    // 🚀 @Transactional aqui é OBRIGATÓRIO! Quando deletamos ou alteramos Coleções
    // geridas pelo Hibernate (PersistentBags),
    // a Sessão tem que estar ativa e anexada! Sem o Transactional, ele ia apagar a
    // lista mas "esquecer" de rodar o SQL DELETE no encerramento.
    @Transactional
    public Product update(Long id, Product product) {
        // Buscamos do repositório a entidade original persistida na base
        Product existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Atualizamos os dados primários com o Payload que o Angular nos enviou
        existing.setName(product.getName());
        existing.setPrice(product.getPrice());

        // 🔧 ATUALIZANDO AS COMPOSIÇÕES DA FORMA MAIS SEGURA NO JPA
        if (product.getCompositions() != null) {
            // 1. Removemos fisicamente da coleção os itens que O USUÁRIO APAGOU NO FRONTEND
            // Isso força perfeitamente o Hibernate a gerar o comando DELETE
            existing.getCompositions().removeIf(oldComp ->
                    product.getCompositions().stream().noneMatch(newComp ->
                            newComp.getRawMaterial().getId().equals(oldComp.getRawMaterial().getId())
                    )
            );

            // 2. Atualizamos os que as quantidades que mudaram ou Adicionamos os novos materiais
            product.getCompositions().forEach(newComp -> {
                var match = existing.getCompositions().stream()
                        .filter(oldComp -> oldComp.getRawMaterial().getId().equals(newComp.getRawMaterial().getId()))
                        .findFirst();

                if (match.isPresent()) {
                    // Era um ingrediente que já existia na receita. Apenas atualiza a quantidade e unidade.
                    match.get().setQuantityRequired(newComp.getQuantityRequired());
                    match.get().setMeasure(newComp.getMeasure());
                } else {
                    // É um ingrediente totalmente novo, então precisamos puxar do banco e adicionar na lista
                    RawMaterial realRawMaterial = rawMaterialRepository
                            .findById(newComp.getRawMaterial().getId())
                            .orElseThrow(() -> new RuntimeException("Raw material not found"));
                    newComp.setRawMaterial(realRawMaterial);
                    newComp.setMeasure(newComp.getMeasure());
                    newComp.setProduct(existing);
                    existing.getCompositions().add(newComp);
                }
            });
        } else {
            // Se tiver apagado todos os ingredientes do produto, limpamos a entidade do banco
            existing.getCompositions().clear();
        }

        // Merge geral: Vai empurrar para o DB de uma só vez a mudança de Nome, os
        // antigos DELETADOS e os novos filhotes INSERIDOS!
        return repository.save(existing);
    }


    public List<Product> findAll() {
        // return repository.findAll();
        // com ordenação por ordem para envio para a tabela
        return repository.findAll(Sort.by("code").ascending());
    }


    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        repository.deleteById(id);
    }


    public ProductDTO findByIdWithCompositions(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Transforma Product em DTO e exibe a compositions com atributos de RawMaterial
        return new ProductDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getPrice(),
                product.getCompositions().stream()
                        .map(c -> new ProductDTO.CompositionDTO(
                                c.getRawMaterial().getId(),
                                c.getRawMaterial().getName(),
                                c.getQuantityRequired(),
                                c.getMeasure() // AGORA RETORNA A UNIDADE DA RECEITA, NÃO MAIS A DO ESTOQUE
                        ))
                        .collect(Collectors.toList()));
    }

    public ProductMaximumDTO calculateMaxProduction(Long productId) {

        Product product = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int maxProduction = Integer.MAX_VALUE;
        // String limitingMaterial = "";
        RawMaterial limitingMaterial = null;
        BigDecimal missingQuantity = BigDecimal.ZERO;

        // 🛡️ ESTUDO: Proteção contra Produto sem Composição
        // Se o produto não tiver ingredientes, a produção máxima é 0 e evitamos o NullPointerException
        // ao tentar acessar 'limitingMaterial.getName()' lá embaixo.
        if (product.getCompositions() == null || product.getCompositions().isEmpty()) {
            return new ProductMaximumDTO(
                    product.getId(),
                    product.getCode(),
                    product.getName(),
                    0,
                    "N/A (Sem Ingredientes)",
                    BigDecimal.ZERO,
                    null);
        }

        for (var comp : product.getCompositions()) {

            // 📏 NORMALIZAÇÃO DE UNIDADES (O PULO DO GATO)
            // "Foi retirado o kg e L do enum back/front para não gerar imprecisão" deixando tudo desde o cadastro de material em Grama, ml e unidade!
            // Se o estoque estiver em KG e a receita em G, multiplicamos o estoque por 1000.
            // Isso permite que o cálculo de divisão seja matematicamente correto.
            BigDecimal stock = convertToBaseUnit(comp.getRawMaterial().getQuantityInStock(), comp.getRawMaterial().getMeasure());
            BigDecimal required = convertToBaseUnit(comp.getQuantityRequired(), comp.getMeasure());

            if (required.compareTo(BigDecimal.ZERO) <= 0)
                continue;

            int possible = stock.divide(required, 0, RoundingMode.DOWN).intValue();

            if (possible < maxProduction) {
                maxProduction = possible;
                limitingMaterial = comp.getRawMaterial();

                BigDecimal neededForNext = required.multiply(BigDecimal.valueOf(possible + 1));
                missingQuantity = neededForNext.subtract(stock);
            }
        }

        return new ProductMaximumDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                maxProduction,
                limitingMaterial.getName(),
                missingQuantity,
                limitingMaterial.getMeasure());
    }

    /**
     * 🚀 NOVO MÉTODO DE LISTAGEM COMPLETA (BLINDADO)
     * Retorna todos os produtos com seus cálculos de produção máxima.
     * O try-catch garante que se um produto der erro, o resto da lista carrega!
     */
    public List<ProductMaximumDTO> findAllMaximumProduction() {
        return repository.findAll().stream()
                .map(p -> {
                    try {
                        return calculateMaxProduction(p.getId());
                    } catch (Exception e) {
                        // Se falhar o cálculo de um item, retornamos um DTO de erro seguro
                        return new ProductMaximumDTO(
                                p.getId(),
                                p.getCode(),
                                p.getName(),
                                0,
                                "Erro no Cálculo",
                                BigDecimal.ZERO,
                                null);
                    }
                })
                .collect(Collectors.toList());
    }

    public ProductionOptimizationDTO optimizeProduction() {

        List<Product> products = repository.findAll();

        List<ProductAnalysisDTO> analysis = new ArrayList<>();

        BigDecimal bestRevenue = BigDecimal.ZERO;
        int bestProduction = 0;
        String recommendedProduct = "";

        for (Product product : products) {

            int maxProduction = calculateMaxProduction(product.getId()).getMaxProduction();

            BigDecimal price = product.getPrice();

            BigDecimal estimatedRevenue = price.multiply(BigDecimal.valueOf(maxProduction));

            analysis.add(new ProductAnalysisDTO(
                    product.getId(),
                    product.getCode(),
                    product.getName(),
                    maxProduction,
                    price,
                    estimatedRevenue));
            //Essa regra só pega a maior receita e ignora em caso de empate e ter maior produção
            //if (estimatedRevenue.compareTo(bestRevenue) > 0) {
            //bestRevenue = estimatedRevenue;
                //recommendedProduct = product.getName();
            //}
            //}

            // REGRA COMPLETA QUE PEGA AMBOS E O QUE TIVER MAIOR PRODUÇÃO E RECEITA GANHA!
            if (estimatedRevenue.compareTo(bestRevenue) > 0 ||
                    (estimatedRevenue.compareTo(bestRevenue) == 0 && maxProduction > bestProduction)) {

                bestRevenue = estimatedRevenue;
                bestProduction = maxProduction;
                recommendedProduct = product.getName();
            }
        }

        return new ProductionOptimizationDTO(
                analysis,
                recommendedProduct);
    }

    public ProductionSimulationDTO simulateProduction(Long productId, Integer quantity) {

        Product product = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // requestedQuantity e possibleQuantity precisam existir?
        // Porque eles são manipulados no método.
        Integer requestedQuantity = quantity;
        Integer possibleQuantity = 0;
        String limitingMaterial = null;
        List<MissingMaterialDTO> missingMaterials = new ArrayList<>();
        List<MaterialConsumptionDTO> materials = new ArrayList<>();
        List<HighStockMaterialDTO> highStockMaterials = new ArrayList<>();

        int maxProduction = Integer.MAX_VALUE;

        for (var comp : product.getCompositions()) {

            RawMaterial material = comp.getRawMaterial();

            // 📏 NORMALIZAÇÃO DE UNIDADES NA SIMULAÇÃO
            BigDecimal stock = convertToBaseUnit(material.getQuantityInStock(), material.getMeasure());
            BigDecimal requiredPerUnit = convertToBaseUnit(comp.getQuantityRequired(), comp.getMeasure());
            BigDecimal totalRequired = requiredPerUnit.multiply(BigDecimal.valueOf(requestedQuantity));

            materials.add(
                    new MaterialConsumptionDTO(
                            material.getName(),
                            totalRequired,
                            stock,
                            comp.getMeasure())); // EXIBE A MEDIDA DA RECEITA

            if (stock.compareTo(totalRequired) < 0) {

                BigDecimal missing = totalRequired.subtract(stock);

                missingMaterials.add(
                        new MissingMaterialDTO(
                                material.getName(),
                                missing));

                // define o material limitante
                if (limitingMaterial == null) {
                    limitingMaterial = material.getName();
                }
            }

            int possible = stock
                    .divide(requiredPerUnit, 0, RoundingMode.DOWN)
                    .intValue();

            if (possible < maxProduction) {
                maxProduction = possible;
            }

            // Regra para os itens que estão em alta no estoque
            if (stock.compareTo(totalRequired) > 0) {

                highStockMaterials.add(
                        new HighStockMaterialDTO(
                                material.getId(),
                                material.getCode(),
                                material.getName(),
                                stock,
                                material.getMeasure())

                );

            }
        }

        possibleQuantity = maxProduction;

        // Esse "If=lógica de fluxo do método" mostra se a simulação "for" acima
        // for abaixo dos itens de estoque "sobra lá"
        // para não mostrar null/vazio mostra estoque suficiente!
        // se passar do itens ele cai na regra no for acima mostrando qual itens falta!
        if (limitingMaterial == null) {
            limitingMaterial = "SUFFICIENT_STOCK";
        }

        return new ProductionSimulationDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                requestedQuantity,
                possibleQuantity,
                limitingMaterial,
                missingMaterials,
                materials,
                highStockMaterials);
    }

    /**
     * 📏 MÉTODO DE CONVERSÃO (SIMPLIFICADO)
     * Padronizamos o sistema para gramas, ml e unidades.
     * Agora que KG e L foram removidos do Enum, o método apenas
     * garante que a quantidade seja retornada corretamente.
     */
    private BigDecimal convertToBaseUnit(BigDecimal quantity, com.inventory.enums.UnitOfMeasure measure) {
        return quantity != null ? quantity : BigDecimal.ZERO;
    }
}
