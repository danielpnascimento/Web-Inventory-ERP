import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MaterialService } from './material.service';
import { environment } from '../../environments/environment';
import { RawMaterialFormModel } from '../../shared/models/raw-material-form.model';
import { RawMaterialsListModel } from '../../shared/models/raw-materials-list.model';
import { ActivatedRoute } from '@angular/router';

describe('MaterialService', () => {
  let service: MaterialService;
  let httpMock: HttpTestingController;

  const API = `${environment.apiUrl}/raw-materials`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    });

    service = TestBed.inject(MaterialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Create
  it('should save material (POST)', () => {
    const mockData: RawMaterialFormModel = {
      id: null,
      code: null,
      name: 'Flour',
      quantityInStock: 1000,
      measure: 'G'
    };

    service.saveMaterial(mockData).subscribe(res => {
      expect(res.name).toBe('Flour');
    });

    const req = httpMock.expectOne(`${API}/save`);
    expect(req.request.method).toBe('POST');
    req.flush(mockData);
  });

  // Get All
  it('should get all materials (GET)', () => {
    const mockResponse: RawMaterialsListModel[] = [
      { id: 1, code: 'RM001', name: 'Flour', quantityInStock: 1000, measure: 'G' }
    ];

    service.findAllMaterial().subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${API}/findAll`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Get By Id
  it('should get material by id (GET)', () => {
    const mockResponse: RawMaterialsListModel = {
      id: 1,
      code: 'RM001',
      name: 'Flour',
      quantityInStock: 1000,
      measure: 'G'
    };

    service.findByIdMaterial(1).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${API}/findById/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Update
  it('should update material (PUT)', () => {
    const mockData: RawMaterialFormModel = {
      id: 1,
      code: 'RM001',
      name: 'Flour',
      quantityInStock: 2000,
      measure: 'G'
    };

    service.updateMaterial(1, mockData).subscribe(res => {
      expect(res.quantityInStock).toBe(2000);
    });

    const req = httpMock.expectOne(`${API}/update/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockData);
  });

  // Delete
  it('should delete material (DELETE)', () => {
    service.deleteMaterial(1).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API}/delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  // Simulate
  it('should simulate production (POST)', () => {
    const mockData = { productId: 1, quantity: 10 };

    service.simulate(mockData).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API}/products/simulate`);
    expect(req.request.method).toBe('POST');
    req.flush({ result: 'ok' });
  });

  // Optimization
  it('should get production optimization (GET)', () => {
    const mockResponse = { maxProduction: 10 };

    service.optimization().subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API}/products/production-optimization`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

});



