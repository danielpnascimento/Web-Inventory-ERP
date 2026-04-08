package com.inventory.dto;

import com.inventory.enums.UnitOfMeasure;

import java.math.BigDecimal;

public class HighStockMaterialDTO {
    private Long id;
    private String code;
    private String material;
    private BigDecimal stock;
    private UnitOfMeasure measure;

    public HighStockMaterialDTO(
            Long id,
            String code,
            String material,
            BigDecimal stock,
            UnitOfMeasure measure
    ) {
        this.id = id;
        this.code = code;
        this.material = material;
        this.stock = stock;
        this.measure = measure;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public BigDecimal getStock() {
        return stock;
    }

    public void setStock(BigDecimal stock) {
        this.stock = stock;
    }

    public UnitOfMeasure getMeasure() {
        return measure;
    }

    public void setMeasure(UnitOfMeasure measure) {
        this.measure = measure;
    }
}



