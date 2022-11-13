import { TestBed } from '@angular/core/testing';

import { NgxSpaHoneypotService } from './ngx-spa-honeypot.service';

describe('NgxSpaHoneypotService', () => {
  let service: NgxSpaHoneypotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSpaHoneypotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
