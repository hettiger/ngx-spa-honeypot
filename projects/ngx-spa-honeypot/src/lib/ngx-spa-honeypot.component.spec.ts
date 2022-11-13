import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSpaHoneypotComponent } from './ngx-spa-honeypot.component';

describe('NgxSpaHoneypotComponent', () => {
  let component: NgxSpaHoneypotComponent;
  let fixture: ComponentFixture<NgxSpaHoneypotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSpaHoneypotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSpaHoneypotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
