import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionMaximum } from './production-maximum';
import { ProductionMaximumService } from '../../core/services/production-maximum.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductionMaximumModel } from '../../shared/models/production-maximum.model';

describe('ProductionMaximum', () => {
  let component: ProductionMaximum;
  let fixture: ComponentFixture<ProductionMaximum>;
  let serviceSpy: jasmine.SpyObj<ProductionMaximumService>;

  // Only pass valid values to findAllProductionMaximum
  const mockData: ProductionMaximumModel[] = [
    { id: 1, product: 'Rice', code: 'A1', maxProduction: 100, missingQuantity: 10, measure: 'kg', limitingMaterial: 'M1' },
    { id: 2, product: 'Beans', code: 'F1', maxProduction: 200, missingQuantity: 20, measure: 'kg', limitingMaterial: 'M2' },
    { id: 3, product: 'Pasta', code: 'M1', maxProduction: 50, missingQuantity: 5, measure: 'kg', limitingMaterial: 'M3' }
  ];

  // Configures the test environment
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductionMaximumService', ['findAllProductionMaximum']);

    await TestBed.configureTestingModule({
      imports: [ProductionMaximum, HttpClientTestingModule],
      providers: [
        { provide: ProductionMaximumService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    serviceSpy = TestBed.inject(ProductionMaximumService) as jasmine.SpyObj<ProductionMaximumService>;
    serviceSpy.findAllProductionMaximum.and.returnValue(of(mockData));

    fixture = TestBed.createComponent(ProductionMaximum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Data load test
  it('should load data on init', () => {
    expect(serviceSpy.findAllProductionMaximum).toHaveBeenCalled();
    expect(component.list.length).toBe(3);
  });

  // Max production calculation test
  it('should calculate max production correctly', () => {
    expect(component.maxVal).toBe(200);
  });

  // Product filter test
  it('should filter products by search term', () => {
    component.searchControl.setValue('rice');
    component.filterProduct();

    expect(component.filteredList.length).toBe(1);
    expect(component.filteredList[0].product).toBe('Rice');
  });

  // Product filter test
  it('should handle no results', () => {
    component.searchControl.setValue('xyz');
    component.filterProduct();

    expect(component.noResults).toBeTrue();
  });

  // Pagination test
  it('should paginate correctly', () => {
    component.pageSize = 2;
    component.filterProduct();

    const pageItems = component.getItemsPaginated();
    expect(pageItems.length).toBe(2);
  });

  it('should change page correctly', () => {
    component.totalPages = 3;

    component.changePage(2);
    expect(component.currentPage).toBe(2);

    component.changePage(0);
    expect(component.currentPage).toBe(2);
  });

  it('should generate pages correctly', () => {
    component.totalPages = 5;
    component.currentPage = 1;

    const pages = component.getPages();
    expect(pages.length).toBeGreaterThan(0);
  });

  // Null values test
  it('should handle null maxProduction values', () => {
    serviceSpy.findAllProductionMaximum.and.returnValue(of([
      {
        id: 1,
        product: 'A',
        code: 'A1',
        maxProduction: null as any,
        missingQuantity: 0,
        measure: 'kg',
        limitingMaterial: 'M1'
      },
      {
        id: 2,
        product: 'B',
        code: 'B1',
        maxProduction: 50,
        missingQuantity: 0,
        measure: 'kg',
        limitingMaterial: 'M2'
      }
    ]));

    component.loadProductionMaximum();

    expect(component.maxVal).toBe(50);
  });

  // Filter by other fields (code, id)
  it('should filter by code', () => {
    component.searchControl.setValue('F1');
    component.filterProduct();

    expect(component.filteredList.length).toBe(1);
  });

  // Null values test
  it('should calculate maxVal ignoring null values', () => {
    serviceSpy.findAllProductionMaximum.and.returnValue(of([
      {
        id: 1,
        product: 'A',
        code: 'A1',
        maxProduction: null as any,
        missingQuantity: 0,
        measure: 'kg',
        limitingMaterial: 'M1'
      },
      {
        id: 2,
        product: 'B',
        code: 'B1',
        maxProduction: 50,
        missingQuantity: 0,
        measure: 'kg',
        limitingMaterial: 'M2'
      }
    ]));

    component.loadProductionMaximum();

    expect(component.maxVal).toBe(50);
  });

});

