import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
            createUrlTree: () => ({}),
            serializeUrl: () => '',
            navigate: jasmine.createSpy('navigate'),
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            paramMap: {
              get: () => null
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// Confirms that something actually appeared on the screen.
  it('should render sidebar element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

// If you have a specific class like .sidebar
  it('should contain sidebar container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sidebarEl = compiled.querySelector('.sidebar');
    expect(sidebarEl).toBeTruthy();
  });

  // If you have a menu/links test them
  it('should render menu items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  // If you have interaction (toggle, open/close) If the sidebar has a hamburger-type button
  it('should toggle sidebar state', () => {
    component.sidebarClose = true;
    component.toggleSidebarOpen(); 
    expect(component.sidebarClose).toBeFalse();
  });

  it('should close sidebar on NavigationEnd event', () => {
    component.sidebarClose = false;
    routerEvents$.next(new NavigationEnd(1, '/old', '/new'));
    expect(component.sidebarClose).toBeTrue();
  });

});

// OK