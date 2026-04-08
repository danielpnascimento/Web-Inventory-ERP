package com.inventory.controller;

import com.inventory.dto.ProductDTO;
import com.inventory.dto.ProductMaximumDTO;
import com.inventory.dto.ProductionOptimizationDTO;
import com.inventory.dto.ProductionSimulationDTO;
import com.inventory.entity.Product;
import com.inventory.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
//@CrossOrigin("*")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping("/save")

    public ProductDTO save(@RequestBody Product product) {
        return service.save(product);
    }

    @PutMapping("/update/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return service.update(id, product);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/findAll")
    public List<Product> findAll() {
        return service.findAll();
    }

    @GetMapping("/findById/{id}")
    public Product findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/compositions/{id}")
    public ProductDTO findByIdWithCompositions(@PathVariable Long id) {
        return service.findByIdWithCompositions(id);
    }

    @GetMapping("/max-production/{id}")
    public ProductMaximumDTO getMaxProduction(@PathVariable Long id) {
        return service.calculateMaxProduction(id);
    }

    @GetMapping("/all-maximum-production")
    public List<ProductMaximumDTO> findAllMaximumProduction() {
        return service.findAllMaximumProduction();
    }

    @GetMapping("/all-production-optimization")
    public ProductionOptimizationDTO optimizeProduction() {
        return service.optimizeProduction();
    }

    @GetMapping("/simulate/{productId}")
    public ProductionSimulationDTO simulate(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        return service.simulateProduction(productId, quantity);
    }
}



