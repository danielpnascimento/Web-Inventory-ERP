import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../core/services/material.service';
import { ProductService } from '../../core/services/product.service';
import { ProductionMaximumService } from '../../core/services/production-maximum.service';
import { ProductionOptimizationService } from '../../core/services/production-optimization.service';
import { of } from 'rxjs';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const mockMaterialService = {
    findAllMaterial: jasmine.createSpy().and.returnValue(of([]))
  };

  const mockProductService = {
    findAllProduct: jasmine.createSpy().and.returnValue(of([]))
  };

  const mockProductionMaximumService = {
    findAllProductionMaximum: jasmine.createSpy().and.returnValue(of([]))
  };

  const mockProductionOptimizationService = {
    findAllProductionOptimization: jasmine.createSpy().and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} }
          }
        },

        { provide: MaterialService, useValue: mockMaterialService },
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductionMaximumService, useValue: mockProductionMaximumService },
        { provide: ProductionOptimizationService, useValue: mockProductionOptimizationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test topProduct$
  it('should return product with highest production', (done) => {
    const mockData = [
      { maxProduction: 10 },
      { maxProduction: 50 },
      { maxProduction: 30 }
    ];

    mockProductionMaximumService.findAllProductionMaximum.and.returnValue(of(mockData));

    component = TestBed.createComponent(Dashboard).componentInstance;

    component.topProduct$.subscribe(result => {
      expect(result?.maxProduction).toBe(50);
      done();
    });
  });

  // Test topOptimization$
  it('should return recommended optimized product', (done) => {
    const mockData = {
      recommendedProduct: 'Product B',
      productsMaximum: [
        { product: 'Product A' },
        { product: 'Product B' }
      ]
    };

    mockProductionOptimizationService.findAllProductionOptimization.and.returnValue(of(mockData));

    component = TestBed.createComponent(Dashboard).componentInstance;

    component.topOptimization$.subscribe(result => {
      expect(result?.product).toBe('Product B');
      done();
    });
  });

  // Test sorting (materialsSorted$)
  it('should sort materials by quantity desc', (done) => {
    const mockMaterials = [
      { quantityInStock: 10 },
      { quantityInStock: 50 },
      { quantityInStock: 30 }
    ];

    mockMaterialService.findAllMaterial.and.returnValue(of(mockMaterials));

    component = TestBed.createComponent(Dashboard).componentInstance;

    component.materialsSorted$.subscribe(result => {
      expect(result[0].quantityInStock).toBe(50);
      expect(result[1].quantityInStock).toBe(30);
      expect(result[2].quantityInStock).toBe(10);
      done();
    });
  });
});
