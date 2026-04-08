package com.inventory.dto;

import java.math.BigDecimal;

public class MissingMaterialDTO {

    private String material;
    private BigDecimal missing;

    public MissingMaterialDTO(String material, BigDecimal missing) {
        this.material = material;
        this.missing = missing;
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
}



