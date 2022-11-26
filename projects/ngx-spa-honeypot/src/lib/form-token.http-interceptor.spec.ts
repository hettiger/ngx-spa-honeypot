import { TestBed } from '@angular/core/testing';

import { FormTokenHttpInterceptor } from './form-token.http-interceptor';

describe('FormTokenInterceptorService', () => {
  let service: FormTokenHttpInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormTokenHttpInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
