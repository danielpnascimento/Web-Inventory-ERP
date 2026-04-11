import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialsList } from './raw-materials-list';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RawMaterialsList', () => {
  let component: RawMaterialsList;
  let fixture: ComponentFixture<RawMaterialsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMaterialsList, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RawMaterialsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

