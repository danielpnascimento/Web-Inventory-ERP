package com.inventory.entity;

import com.inventory.enums.UnitOfMeasure;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.math.BigDecimal;

@Entity
@Table(name = "product_compositions")
public class ProductComposition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "raw_material_id")
    private RawMaterial rawMaterial;

    @Column(nullable = false)
    private BigDecimal quantityRequired;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UnitOfMeasure measure;

    public ProductComposition() {
    }

    public ProductComposition(Long id, Product product, RawMaterial rawMaterial, BigDecimal quantityRequired, UnitOfMeasure measure) {
        this.id = id;
        this.product = product;
        this.rawMaterial = rawMaterial;
        this.quantityRequired = quantityRequired;
        this.measure = measure;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public RawMaterial getRawMaterial() {
        return rawMaterial;
    }

    public void setRawMaterial(RawMaterial rawMaterial) {
        this.rawMaterial = rawMaterial;
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



