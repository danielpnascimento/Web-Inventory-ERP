import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

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
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Only pass valid values ​​to findAllProduct.
  it('should call findAllProduct (GET)', () => {
    service.findAllProduct().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products/findAll`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  // Only pass valid values ​​to saveProduct.
  it('should call saveProduct (POST)', () => {
    const mock = {
      id: null,
      code: null,
      name: 'Product Test',
      price: 10,
      compositions: []
    };

    service.saveProduct(mock).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mock);

    req.flush({});
  });

  // Only pass valid values ​​to deleteProduct.
  it('should call deleteProduct (DELETE)', () => {
    service.deleteProduct(1).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/products/delete/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
