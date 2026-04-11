import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 1 } } },
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

// Rendering test: checks if the component renders the title
  it('should render navbar title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });

 // Interaction test: checks if the toggleMenu method works
  it('should toggle menu', () => {
    component.navbarClose = true; 
    component.toggleNavbarOpen();
    expect(component.navbarClose).toBeFalse();

    component.toggleNavbarOpen();
    expect(component.navbarClose).toBeTrue();
  });

});

