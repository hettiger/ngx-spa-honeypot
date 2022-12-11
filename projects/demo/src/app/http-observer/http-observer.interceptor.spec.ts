import { TestBed } from '@angular/core/testing';

import { HttpObserverInterceptor } from './http-observer.interceptor';

describe('HttpObserverInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpObserverInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpObserverInterceptor = TestBed.inject(HttpObserverInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
