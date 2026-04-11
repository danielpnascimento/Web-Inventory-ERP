import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionOptimization } from './production-optimization';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('ProductionOptimization', () => {
  let component: ProductionOptimization;
  let fixture: ComponentFixture<ProductionOptimization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOptimization, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionOptimization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});