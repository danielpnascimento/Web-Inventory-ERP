package com.inventory.controller;

import com.inventory.entity.RawMaterial;
import com.inventory.service.RawMaterialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")
@CrossOrigin(origins = "http://localhost:4200")
public class RawMaterialController {

    private final RawMaterialService service;

    public RawMaterialController(RawMaterialService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public RawMaterial save(@RequestBody RawMaterial rawMaterial) {
        return service.save(rawMaterial);
    }

    @PutMapping("/update/{id}")
    public RawMaterial update(@PathVariable Long id, @RequestBody RawMaterial rawMaterial) {
        return service.update(id, rawMaterial);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/findAll")
    public List<RawMaterial> findAll() {
        return service.findAll();
    }

    @GetMapping("findAll/high-stock")
    public List<RawMaterial> getHighStockMaterials(){
        return service.getHighStockMaterials();
    }

    @GetMapping("/findById/{id}")
    public RawMaterial findById(@PathVariable Long id) {
        return service.findById(id);
    }


}