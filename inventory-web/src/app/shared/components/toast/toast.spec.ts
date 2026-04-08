import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toast } from './toast';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
