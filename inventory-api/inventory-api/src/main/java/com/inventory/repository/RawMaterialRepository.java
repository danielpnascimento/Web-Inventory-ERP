package com.inventory.repository;

import com.inventory.entity.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//Busca padrão
public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {

    //Search by item in high demand in stock.
    List<RawMaterial> findAllByOrderByQuantityInStockDesc();
}




