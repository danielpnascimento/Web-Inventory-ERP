package com.inventory.service;

import com.inventory.dto.ProductDTO;
import com.inventory.entity.*;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.RawMaterialRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    private ProductService service;


    // Test 1 - Save success
    @Test
    void shouldSaveProductSuccessfully() {

        RawMaterial material = new RawMaterial();
        material.setId(1L);
        material.setName("Flour");

        Product product = new Product();
        product.setName("Bread");

        ProductComposition comp = new ProductComposition();
        comp.setRawMaterial(material);
        comp.setQuantityRequired(new BigDecimal("100"));

        product.setCompositions(List.of(comp));

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(material));

        when(repository.save(any())).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            if (p.getId() == null) {
                p.setId(1L);
            }
            return p;
        });

        ProductDTO result = service.save(product);

        assertEquals("Prod001", result.getCode());
        assertEquals("Bread", result.getName());
        assertEquals(1, result.getCompositions().size());

        verify(repository, times(2)).save(any());
    }

    // Test 2 - Save without composition
    @Test
    void shouldThrowExceptionWhenNoCompositions() {

        Product product = new Product();
        product.setName("Bread");

        assertThrows(ResponseStatusException.class, () -> {
            service.save(product);
        });
    }

    // Test 3 - Update
    @Test
    void shouldUpdateProductName() {

        Product existing = new Product();
        existing.setId(1L);
        existing.setName("Bread Old");

        Product update = new Product();
        update.setName("Bread New");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        Product result = service.update(1L, update);
        assertEquals("Bread New", result.getName());
    }


    // Test 4 - FindByID
    @Test
    void shouldFindProductById() {

        Product product = new Product();
        product.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(product));
        Product result = service.findById(1L);
        assertEquals(1L, result.getId());
    }


    // Test 5 - FindByID ERRO
    @Test
    void shouldThrowWhenProductNotFound() {

        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.findById(1L);
        });
    }


    // Teste 6 - Delete
    @Test
    void shouldDeleteProduct() {

        when(repository.existsById(1L)).thenReturn(true);
        service.delete(1L);
        verify(repository).deleteById(1L);
    }


    // TESTE 7 - Delete ERRO
    @Test
    void shouldThrowWhenDeletingNonExistingProduct() {

        when(repository.existsById(1L)).thenReturn(false);
        assertThrows(ResponseStatusException.class, () -> {
            service.delete(1L);
        });
    }

    // Test 8 - Calculate Production
    @Test
    void shouldCalculateMaxProduction() {

        RawMaterial material = new RawMaterial();
        material.setQuantityInStock(new BigDecimal("1000"));

        ProductComposition comp = new ProductComposition();
        comp.setRawMaterial(material);
        comp.setQuantityRequired(new BigDecimal("100"));

        Product product = new Product();
        product.setCompositions(List.of(comp));

        when(repository.findById(1L)).thenReturn(Optional.of(product));
        var result = service.calculateMaxProduction(1L);
        assertTrue(result.getMaxProduction() > 0);
    }


    // Test 9 - Simulation
    @Test
    void shouldSimulateProduction() {

        RawMaterial material = new RawMaterial();
        material.setName("Flour");
        material.setQuantityInStock(new BigDecimal("1000"));

        ProductComposition comp = new ProductComposition();
        comp.setRawMaterial(material);
        comp.setQuantityRequired(new BigDecimal("200"));

        Product product = new Product();
        product.setCompositions(List.of(comp));

        when(repository.findById(1L)).thenReturn(Optional.of(product));

        var result = service.simulateProduction(1L, 2);
        assertNotNull(result);
    }

    // Test 10 - FIND ALL
    @Test
    void shouldReturnAllProducts() {

        when(repository.findAll()).thenReturn(List.of(new Product(), new Product()));
        List<Product> result = service.findAll();
        assertEquals(2, result.size());
    }

    // Test 11 - OPTIMIZE
    @Test
    void shouldOptimizeProduction() {

        Product product = new Product();
        product.setId(1L);
        when(repository.findAll()).thenReturn(List.of(product));
        var result = service.optimizeProduction();
        assertNotNull(result);
    }
}



