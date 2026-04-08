import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTable } from './data-table';
import { ActivatedRoute } from '@angular/router';

describe('DataTable', () => {
  let component: DataTable;
  let fixture: ComponentFixture<DataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
