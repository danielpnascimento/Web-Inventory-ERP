package com.inventory.service;

import com.inventory.entity.RawMaterial;
import com.inventory.enums.UnitOfMeasure;
import com.inventory.repository.RawMaterialRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RawMaterialServiceTest {

    @Mock
    private RawMaterialRepository repository;

    @InjectMocks
    private RawMaterialService service;

    //Test A - "Tested creating an object with ID RM001"
    @Test
    void shouldSaveRawMaterialAndGenerateCode() {
        RawMaterial material = new RawMaterial();
        material.setName("Flour");

        RawMaterial saved = new RawMaterial();
        saved.setId(1L);

        when(repository.save(any())).thenReturn(saved);

        RawMaterial result = service.save(material);
        assertEquals("RM001", result.getCode());
        verify(repository, times(2)).save(any());
    }

    //Test B - Tests whether the material is saved while maintaining the correct name, quantity, and unit.
    @Test
    void shouldSaveMaterialWithCorrectMeasure() {
        RawMaterial material = new RawMaterial();
        material.setName("Flour");
        material.setQuantityInStock(new BigDecimal("1000.0"));
        material.setMeasure(UnitOfMeasure.G);

        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        RawMaterial result = service.save(material);
        assertEquals("Flour", result.getName());
        assertEquals(new BigDecimal("1000.0"), result.getQuantityInStock());
        assertEquals(UnitOfMeasure.G, result.getMeasure());
        assertEquals(0, result.getQuantityInStock().compareTo(new BigDecimal("1000.0")));
    }
}




