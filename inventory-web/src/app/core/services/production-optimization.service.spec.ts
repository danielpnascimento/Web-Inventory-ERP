import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductionOptimization } from '../../pages/production-optimization/production-optimization';
import { ProductionOptimizationService } from '../../core/services/production-optimization.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ProductAnalysis, ProductionOptimizationModel } from '../../shared/models/production-optimization.model';

describe('ProductionOptimization', () => {
  let component: ProductionOptimization;
  let fixture: ComponentFixture<ProductionOptimization>;
  let service: jasmine.SpyObj<ProductionOptimizationService>;

  // Mock data to simulate backend response
  const mockData: ProductionOptimizationModel = {
    recommendedProduct: 'Product A',
    productsMaximum: [
      { id: 1, product: 'Product A', code: 'A01', maxProduction: 100, unitPrice: 10, estimatedRevenue: 1000 },
      { id: 2, product: 'Product B', code: 'B01', maxProduction: 80, unitPrice: 20, estimatedRevenue: 1600 },
      { id: 3, product: 'Product C', code: 'C01', maxProduction: 50, unitPrice: 30, estimatedRevenue: 1500 }
    ]
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ProductionOptimizationService', ['findAllProductionOptimization']);

    await TestBed.configureTestingModule({
      imports: [ProductionOptimization, HttpClientTestingModule],
      providers: [
        { provide: ProductionOptimizationService, useValue: serviceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionOptimization);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductionOptimizationService) as jasmine.SpyObj<ProductionOptimizationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to verify that the data is loaded correctly.
  it('should load data and calculate maxVal', fakeAsync(() => {
    service.findAllProductionOptimization.and.returnValue(of(mockData));
    component.ngOnInit();
    tick();
    expect(component.list.length).toBe(3);
    expect(component.recommendedProduct).toBe('Product A');
    expect(component.maxVal).toBe(100);
    expect(component.filteredList.length).toBe(3);
    expect(component.noResults).toBeFalse();
  }));

  // Test to verify that the error is handled correctly.
  it('should handle error on load', fakeAsync(() => {
    spyOn(console, 'error');
    service.findAllProductionOptimization.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error fetching optimized production:', jasmine.any(Error));
  }));

  // Test to verify that the products are filtered correctly.
  it('should filter products correctly', () => {
    component.list = [...mockData.productsMaximum];
    component.searchControl.setValue('Product B');
    component.filterProduct();
    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].product).toBe('Product B');

    component.searchControl.setValue('B01');
    component.filterProduct();
    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].code).toBe('B01');

    component.searchControl.setValue('999'); 
    component.filterProduct();
    expect(component.filteredList.length).toBe(0);
    expect(component.noResults).toBeTrue();
  });

  // Test to verify that the items are paginated correctly.
  it('should paginate items correctly', () => {
    component.list = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1, product: `Product ${i + 1}`,
      code: `C${i + 1}`,
      maxProduction: i + 1,
      unitPrice: 10,
      estimatedRevenue: 100
    }));
    component.filterProduct();
    component.pageSize = 10;
    component.currentPage = 1;
    expect(component.getItemsPaginated().length).toBe(10);

    component.currentPage = 3;
    expect(component.getItemsPaginated().length).toBe(5);
  });

  // Test to verify that the pages are changed correctly.
  it('should change pages correctly', () => {
    component.totalPages = 5;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(1);

    component.changePage(4);
    expect(component.currentPage).toBe(4);

    component.changePage(0); 
    expect(component.currentPage).toBe(4);

    component.changePage(6);
    expect(component.currentPage).toBe(4);
  });

  // Test to verify that the pages array is generated correctly.
  it('should generate correct pages array', () => {
    component.totalPages = 5;
    component.currentPage = 1;
    let pages = component.getPages();
    expect(pages).toEqual([1, 2, 3]);

    component.currentPage = 5;
    pages = component.getPages();
    expect(pages).toEqual([3, 4, 5]);
  });

  // Test to verify that the trackById is working correctly.
  it('should trackById correctly', () => {
    const item = { id: 123, product: 'Test' } as ProductAnalysis;
    expect(component.trackById(0, item)).toBe(123);
  });
});




