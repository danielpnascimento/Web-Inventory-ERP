package com.inventory.entity;

import com.inventory.enums.UnitOfMeasure;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

@Entity
@Table(name = "raw_materials")
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @PositiveOrZero //para registro de apenas n° positivos
    private BigDecimal quantityInStock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private UnitOfMeasure measure;

    public RawMaterial() {
    }

    public RawMaterial(Long id, String code, String name, BigDecimal quantityInStock, UnitOfMeasure measure) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.quantityInStock = quantityInStock;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getQuantityInStock() {
        return quantityInStock;
    }

    public void setQuantityInStock(BigDecimal quantityInStock) {
        this.quantityInStock = quantityInStock;
    }

    public UnitOfMeasure getMeasure() {
        return measure;
    }

    public void setMeasure(UnitOfMeasure measure) {
        this.measure = measure;
    }
}




