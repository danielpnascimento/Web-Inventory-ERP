import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductionMaximumService } from './production-maximum.service';
import { environment } from '../../environments/environment';
import { ProductionMaximumModel } from '../../shared/models/production-maximum.model';

describe('ProductionMaximumService', () => {
  let service: ProductionMaximumService;
  let httpMock: HttpTestingController;

  const API = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ProductionMaximumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Only pass valid values ​​to the findAllProductionMaximum
  it('should call API and return production maximum list', () => {
    const mockResponse: ProductionMaximumModel[] = [
      { id: 1, product: 'Product A', code: 'A1', maxProduction: 100, missingQuantity: 10, measure: 'kg', limitingMaterial: 'M1' },
      { id: 2, product: 'Product B', code: 'B1', maxProduction: 200, missingQuantity: 20, measure: 'kg', limitingMaterial: 'M2' }
    ];

    // Only pass valid values to the findAllProductionMaximum
    service.findAllProductionMaximum().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    // Only pass valid values to the findAllProductionMaximum
    const req = httpMock.expectOne(`${API}/all-maximum-production`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});

