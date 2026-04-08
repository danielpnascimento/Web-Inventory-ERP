package com.inventory.dto;

import com.inventory.enums.UnitOfMeasure;

import java.math.BigDecimal;
import java.util.List;

public class ProductDTO {

    private Long id;
    private String code;
    private String name;
    private BigDecimal price;
    private List<CompositionDTO> compositions;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String code, String name, BigDecimal price, List<CompositionDTO> compositions) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.price = price;
        this.compositions = compositions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CompositionDTO> getCompositions() {
        return compositions;
    }

    public void setCompositions(List<CompositionDTO> compositions) {
        this.compositions = compositions;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public static class CompositionDTO {
        private Long rawMaterialId;
        private String rawMaterialName;
        private BigDecimal quantityRequired;
        private UnitOfMeasure measure;

        public CompositionDTO() {
        }

        public CompositionDTO(Long rawMaterialId, String rawMaterialName, BigDecimal quantityRequired, UnitOfMeasure measure) {
            this.rawMaterialId = rawMaterialId;
            this.rawMaterialName = rawMaterialName;
            this.quantityRequired = quantityRequired;
            this.measure = measure;
        }

        public Long getRawMaterialId() {
            return rawMaterialId;
        }

        public void setRawMaterialId(Long rawMaterialId) {
            this.rawMaterialId = rawMaterialId;
        }

        public String getRawMaterialName() {
            return rawMaterialName;
        }

        public void setRawMaterialName(String rawMaterialName) {
            this.rawMaterialName = rawMaterialName;
        }

        public BigDecimal getQuantityRequired() {
            return quantityRequired;
        }

        public void setQuantityRequired(BigDecimal quantityRequired) {
            this.quantityRequired = quantityRequired;
        }

        public UnitOfMeasure getMeasure() {
            return measure;
        }

        public void setMeasure(UnitOfMeasure measure) {
            this.measure = measure;
        }
    }
}