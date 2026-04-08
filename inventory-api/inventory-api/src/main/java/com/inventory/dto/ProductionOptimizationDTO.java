package com.inventory.dto;

import java.util.List;

public class ProductionOptimizationDTO {

    private List<ProductAnalysisDTO> productsMaximum;
    private String recommendedProduct;

    public ProductionOptimizationDTO(List<ProductAnalysisDTO> productsMaximum,
                                     String recommendedProduct) {
        this.productsMaximum = productsMaximum;
        this.recommendedProduct = recommendedProduct;
    }

    public List<ProductAnalysisDTO> getProductsMaximum() {
        return productsMaximum;
    }

    public String getRecommendedProduct() {
        return recommendedProduct;
    }
}


