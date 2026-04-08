package com.inventory.dto;

import java.util.List;

public class ProductionSimulationDTO {

    private Long id;
    private String code;
    private String product;
    private Integer requestedQuantity;
    private Integer possibleQuantity;
    private String limitingMaterial;
    private List<MissingMaterialDTO> missingMaterials;
    private List<MaterialConsumptionDTO> materials;
    private List<HighStockMaterialDTO> highStockMaterials;

    public ProductionSimulationDTO(Long id,
                                   String code, String product,
                                   Integer requestedQuantity,
                                   Integer possibleQuantity,
                                   String limitingMaterial,
                                   List<MissingMaterialDTO> missingMaterials,
                                   List<MaterialConsumptionDTO> materials,                                   List<HighStockMaterialDTO> highStockMaterials) {
        this.id = id;
        this.code = code;
        this.product = product;
        this.requestedQuantity = requestedQuantity;
        this.possibleQuantity = possibleQuantity;
        this.limitingMaterial = limitingMaterial;
        this.missingMaterials = missingMaterials;
        this.materials = materials;
        this.highStockMaterials = highStockMaterials;
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

    public void setProduct(String product) {
        this.product = product;
    }

    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(Integer requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    public Integer getPossibleQuantity() {
        return possibleQuantity;
    }

    public void setPossibleQuantity(Integer possibleQuantity) {
        this.possibleQuantity = possibleQuantity;
    }

    public String getLimitingMaterial() {
        return limitingMaterial;
    }

    public void setLimitingMaterial(String limitingMaterial) {
        this.limitingMaterial = limitingMaterial;
    }

    public List<MissingMaterialDTO> getMissingMaterials() {
        return missingMaterials;
    }

    public void setMissingMaterials(List<MissingMaterialDTO> missingMaterials) {
        this.missingMaterials = missingMaterials;
    }

    public List<MaterialConsumptionDTO> getMaterials() {
        return materials;
    }

    public void setMaterials(List<MaterialConsumptionDTO> materials) {
        this.materials = materials;
    }

    public List<HighStockMaterialDTO> getHighStockMaterials() {
        return highStockMaterials;
    }

    public void setHighStockMaterials(List<HighStockMaterialDTO> highStockMaterials) {
        this.highStockMaterials = highStockMaterials;
    }
}
/*
 **Production Simulation with Missing Item Alert**

Simulates before starting production
It takes the recipe/product and calculates the maximum it can generate
based on the stock items and shows where there are gaps/missing items from the
stock, indicating whether that quantity is possible (HighStockMaterialDTO) or not (MissingMaterialDTO)

*/