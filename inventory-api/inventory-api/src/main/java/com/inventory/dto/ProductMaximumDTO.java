package com.inventory.dto;

import com.inventory.enums.UnitOfMeasure;

import java.math.BigDecimal;

public class ProductMaximumDTO {

    private Long id;
    private String code;
    private String product;
    private int maxProduction;
    private String limitingMaterial;
    private BigDecimal missingQuantity;
    private UnitOfMeasure measure;

    public ProductMaximumDTO(Long id, String code, String product, int maxProduction, String limitingMaterial, BigDecimal missingQuantity, UnitOfMeasure measure) {

        this.id = id;
        this.code = code;
        this.product = product;
        this.maxProduction = maxProduction;
        this.limitingMaterial = limitingMaterial;
        this.missingQuantity = missingQuantity;
        this.measure = measure;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getProduct() {
        return product;
    }

    public int getMaxProduction() {
        return maxProduction;
    }

    public String getLimitingMaterial() {
        return limitingMaterial;
    }

    public BigDecimal getMissingQuantity() {
        return missingQuantity;
    }

    public UnitOfMeasure getMeasure() {
        return measure;
    }


}

/*
This is the response from max-production that calculates the maximum number of cakes
of a given flavor/product that can be made using the items in stock.

*/