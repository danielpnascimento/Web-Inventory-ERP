import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementTableCup } from './measurement-table-cup';
import { ActivatedRoute } from '@angular/router';

describe('MeasurementTableCup', () => {
  let component: MeasurementTableCup;
  let fixture: ComponentFixture<MeasurementTableCup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementTableCup],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementTableCup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
