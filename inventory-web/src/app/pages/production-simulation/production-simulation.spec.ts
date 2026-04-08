import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductionSimulation } from './production-simulation';
import { ProductionSimulationService } from '../../core/services/production-simulation.service';
import { ProductService } from '../../core/services/product.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsListModel } from '../../shared/models/products-list.model';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';

describe('ProductionSimulation', () => {
  let component: ProductionSimulation;
  let fixture: ComponentFixture<ProductionSimulation>;
  let productService: jasmine.SpyObj<ProductService>;
  let simulationService: jasmine.SpyObj<ProductionSimulationService>;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', ['findAllProduct']);
    const simulationSpy = jasmine.createSpyObj('ProductionSimulationService', ['simulate']);

    await TestBed.configureTestingModule({
      imports: [ProductionSimulation, HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: ProductionSimulationService, useValue: simulationSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionSimulation);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    simulationService = TestBed.inject(ProductionSimulationService) as jasmine.SpyObj<ProductionSimulationService>;

    productService.findAllProduct.and.returnValue(of([
      { id: 1, name: 'Product A' } as ProductsListModel
    ]));

    fixture.detectChanges();
  });

  // Checks if the ProductionSimulation component is instantiated correctly by Angular.
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests if ngOnInit loads the product list by calling ProdutoService.findAllProduto().
  it('should load products on init', () => {
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Product A');
  });

  // Tests the simulate() function in a success scenario. 
  // Confirms that the simulation works correctly and that the component state is updated.
  it('should call simulate and set result', fakeAsync(() => {
    const mockResult: ProductionSimulationModel = {
      limitingMaterial: 'SUFFICIENT_STOCK',
      id: 0,
      code: '',
      product: '',
      requestedQuantity: 0,
      possibleQuantity: 0,
      missingMaterials: [],
      materials: [],
      highStockMaterials: []
    };
    simulationService.simulate.and.returnValue(of(mockResult));

    component.productId = 1;
    component.quantity = 10;
    component.simulate();

    tick();

    expect(simulationService.simulate).toHaveBeenCalledWith(1, 10);
    expect(component.result).toEqual(mockResult);
    expect(component.loading).toBeFalse();
  }));

  // Tests how the component handles service errors. Ensures the component doesn't break when the API fails.
  it('should handle simulate error', fakeAsync(() => {
    simulationService.simulate.and.returnValue(throwError(() => new Error('API Error')));

    component.productId = 1;
    component.quantity = 10;
    component.simulate();

    tick();

    expect(component.result).toBeNull();
    expect(component.loading).toBeFalse();
  }));

  // Tests the prevention of invalid calls. Prevents the simulate() method from being called with 
  // invalid, unnecessary data and potential errors.
  it('should not simulate if productId or quantity are missing', () => {
    component.productId = null;
    component.quantity = 10;
    component.simulate();
    expect(simulationService.simulate).not.toHaveBeenCalled();

    component.productId = 1;
    component.quantity = null;
    component.simulate();
    expect(simulationService.simulate).not.toHaveBeenCalled();
  });

  // Ensures that pressing Enter triggers the simulation correctly.
  it('handleEnter should call simulate when conditions are met', fakeAsync(() => {
    const mockResult: ProductionSimulationModel = {
      limitingMaterial: 'SUFFICIENT_STOCK',
      id: 0,
      code: '',
      product: '',
      requestedQuantity: 0,
      possibleQuantity: 0,
      missingMaterials: [],
      materials: [],
      highStockMaterials: []
    };
    simulationService.simulate.and.returnValue(of(mockResult));

    component.productId = 1;
    component.quantity = 5;
    component.loading = false;

    component.handleEnter();
    tick();

    expect(simulationService.simulate).toHaveBeenCalled();
  }));

  // Prevents unnecessary, duplicate calls and inconsistencies when the component is processing.
  it('handleEnter should not call simulate when loading', () => {
    component.loading = true;
    component.productId = 1;
    component.quantity = 5;

    component.handleEnter();
    expect(simulationService.simulate).not.toHaveBeenCalled();
  });

  // Checks if the isSufficient and isInsufficient getters return the correct values.
  // Confirms the logic for interpreting the simulation result, which affects the interface (e.g., showing a material shortage warning).
  it('isSufficient and isInsufficient getters', () => {
    component.result = { limitingMaterial: 'SUFFICIENT_STOCK' } as ProductionSimulationModel;
    expect(component.isSufficient).toBeTrue();
    expect(component.isInsufficient).toBeFalse();

    component.result = { limitingMaterial: 'MATERIAL_SHORTAGE' } as ProductionSimulationModel;
    expect(component.isSufficient).toBeFalse();
    expect(component.isInsufficient).toBeTrue();
  });
});



