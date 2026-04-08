import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsForm } from './products-form';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductsForm', () => {
  let component: ProductsForm;
  let fixture: ComponentFixture<ProductsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsForm, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.save(); // test save of ProductsForm (products-form.ts)
    component.addComposition(); // test add composition of ProductsForm (products-form.ts)
    component.createComposition(); // test create composition of ProductsForm (products-form.ts)
  });
});
