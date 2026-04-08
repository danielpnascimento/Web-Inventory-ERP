package com.inventory.service;

import com.inventory.entity.RawMaterial;
import com.inventory.repository.RawMaterialRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RawMaterialService {

    private final RawMaterialRepository repository;

    public RawMaterialService(RawMaterialRepository repository) {
        this.repository = repository;
    }

    public RawMaterial save(RawMaterial rawMaterial) {
        //Generates custom automatic code = User-friendly code without using the ID = dev
        // RM=RawMaterial
        RawMaterial saved = repository.save(rawMaterial);
        String generatedCode = "RM" + String.format("%03d", saved.getId());
        saved.setCode(generatedCode);

        return repository.save(saved);
    }

    public RawMaterial update(Long id, RawMaterial rawMaterial) {
        RawMaterial existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("RawMaterial not found"));

        existing.setName(rawMaterial.getName());
        existing.setQuantityInStock(rawMaterial.getQuantityInStock());
        existing.setMeasure(rawMaterial.getMeasure());

        return repository.save(existing);
    }

    //busca padrão
    public List<RawMaterial> findAll() {
//        return repository.findAll();
        //com ordenação por ordem para envio para a tabela
        return repository.findAll(Sort.by("code").ascending());
    }

    //busca por itens em alta no estoque
    public List<RawMaterial> getHighStockMaterials() {
        return repository.findAllByOrderByQuantityInStockDesc();
    }

    public RawMaterial findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));
    }

    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        repository.deleteById(id);
    }



}

