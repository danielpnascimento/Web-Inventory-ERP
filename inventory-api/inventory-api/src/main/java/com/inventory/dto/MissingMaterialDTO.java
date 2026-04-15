package com.inventory.dto;

import com.inventory.enums.UnitOfMeasure;

import java.math.BigDecimal;

public class MissingMaterialDTO {

    private String material;
    private BigDecimal missing;
    private UnitOfMeasure measure;


    public MissingMaterialDTO(String material, BigDecimal missing, UnitOfMeasure measure) {
        this.material = material;
        this.missing = missing;
        this.measure = measure;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public BigDecimal getMissing() {
        return missing;
    }

    public void setMissing(BigDecimal missing) {
        this.missing = missing;
    }

    public UnitOfMeasure getMeasure() {
        return measure;
    }

    public void setMeasure(UnitOfMeasure measure) {
        this.measure = measure;
    }
}