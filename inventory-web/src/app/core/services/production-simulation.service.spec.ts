import { TestBed } from '@angular/core/testing';
import { ProductionSimulationService } from './production-simulation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductionSimulationModel } from '../../shared/models/production-simulation.model';

describe('ProductionSimulationService', () => {
  let service: ProductionSimulationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProductionSimulationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test to verify that the API is called correctly
  it('should call simulate API with correct params', () => {
    const mockResponse: ProductionSimulationModel = {
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

    // Test to verify that the API is called correctly
    service.simulate(5, 100).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Test to verify that the API is called correctly
    const req = httpMock.expectOne(`${service['API']}/simulate/5?quantity=100`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); 
  });

  afterEach(() => {
    httpMock.verify(); 
  });
});