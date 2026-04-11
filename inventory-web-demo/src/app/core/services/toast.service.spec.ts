import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { NgZone } from '@angular/core';

describe('ToastService', () => {
  let service: ToastService;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
    ngZone = TestBed.inject(NgZone);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Group related tests; I'll test everything related to show() here.
  describe('show()', () => {
    it('should emit a toast message with correct data', (done) => {
      const message = 'Success';
      const type = 'success';
      service.toast$.subscribe((toast) => {
        expect(toast).toEqual({ message, type });
        done();
      });

      service.show(message, type);
    });

  });

  describe('confirm()', () => {

    it('should emit a confirm toast with correct structure', (done) => {
      const message = 'Are you sure?';

      service.toast$.subscribe((toast: any) => {
        expect(toast.message).toBe(message);
        expect(toast.type).toBe('warning');
        expect(toast.confirm).toBeTrue();
        expect(typeof toast.onConfirm).toBe('function');
        done();
      });

      service.confirm(message, () => { });
    });

    // Creates a fake (spy) function.
    it('should execute callback when onConfirm is called', () => {
      // Pretend it's a function and tell me if someone called it.
      const callback = jasmine.createSpy('callback');

      service.toast$.subscribe((toast: any) => {
        toast.onConfirm();
      });

      service.confirm('Confirm action', callback);

      expect(callback).toHaveBeenCalled();
    });

    it('should execute callback inside NgZone.run', () => {
      const callback = jasmine.createSpy('callback');
      // When I call ngZone.run, I control what happens.
      spyOn(ngZone, 'run').and.callFake((fn: Function) => fn());

      service.toast$.subscribe((toast: any) => {
        // Execute the callback you created in the service.
        toast.onConfirm();
      });

      service.confirm('Confirm action', callback);

      expect(ngZone.run).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });

  });

});



