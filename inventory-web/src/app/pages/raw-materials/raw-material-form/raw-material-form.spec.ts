import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialForm } from './raw-material-form';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RawMaterialForm', () => {
  let component: RawMaterialForm;
  let fixture: ComponentFixture<RawMaterialForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialForm, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RawMaterialForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
