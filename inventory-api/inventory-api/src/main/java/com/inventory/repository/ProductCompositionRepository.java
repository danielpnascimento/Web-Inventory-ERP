package com.inventory.repository;

import com.inventory.entity.ProductComposition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCompositionRepository
        extends JpaRepository<ProductComposition, Long> {
}

