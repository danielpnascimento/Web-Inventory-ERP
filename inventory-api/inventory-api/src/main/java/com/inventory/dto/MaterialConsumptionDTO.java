package com.inventory.dto;

import com.inventory.enums.UnitOfMeasure;

import java.math.BigDecimal;

public class MaterialConsumptionDTO {

    private String material;
    private BigDecimal required;
    private BigDecimal stock;
    private UnitOfMeasure measure;

    public MaterialConsumptionDTO(String material,
                                  BigDecimal required,
                                  BigDecimal stock,
                                  UnitOfMeasure measure) {
        this.material = material;
        this.required = required;
        this.stock = stock;
        this.measure = measure;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public BigDecimal getRequired() {
        return required;
    }

    public void setRequired(BigDecimal required) {
        this.required = required;
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
