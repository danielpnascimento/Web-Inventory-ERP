package com.inventory.dto;

import java.math.BigDecimal;

public class ProductAnalysisDTO {

    private Long id;
    private String code;
    private String product;
    private int maxProduction;
    private BigDecimal unitPrice;
    private BigDecimal estimatedRevenue;

    public ProductAnalysisDTO(Long id,
                              String code, String product,
                              int maxProduction,
                              BigDecimal unitPrice,
                              BigDecimal estimatedRevenue) {
        this.id = id;
        this.code = code;
        this.product = product;
        this.maxProduction = maxProduction;
        this.unitPrice = unitPrice;
        this.estimatedRevenue = estimatedRevenue;
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

    public String getProduct() {
        return product;
    }

    public String setProduct() {
        return product;
    }

    public int getMaxProduction() {
        return maxProduction;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getEstimatedRevenue() {
        return estimatedRevenue;
    }
}



