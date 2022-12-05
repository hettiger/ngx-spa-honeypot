import { FormTokenDirective } from './form-token.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpaHoneypotModule } from './spa-honeypot.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FormTokenHttpInterceptor } from './form-token.http-interceptor';
import { FormToken } from './form-token';

@Component({
  template: `
    <form action="https://domain.tld/api/endpoint">
      <input type="text" name="example" id="example" ngModel>
    </form>
  `,
})
class TestComponent {}

describe('FormTokenManagerDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let formDebugElement: DebugElement;
  let form: HTMLFormElement;
  let inputDebugElement: DebugElement;
  let input: HTMLInputElement;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let httpInterceptor: FormTokenHttpInterceptor;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      imports: [ SpaHoneypotModule, FormsModule, HttpClientTestingModule ],
    })
    .createComponent(TestComponent);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpInterceptor = TestBed.inject(FormTokenHttpInterceptor);

    fixture.detectChanges();

    formDebugElement = fixture.debugElement.query(By.directive(FormTokenDirective));
    form = formDebugElement.nativeElement;
    inputDebugElement = formDebugElement.query(By.css('input'));
    input = inputDebugElement.nativeElement;

    spyOn(httpInterceptor, 'sendFormTokenOnNextRequest');
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('does not request initial form token until first input', () => {
    expectNoFormTokenRequest();
  })

  it('requests initial form token on first input', () => {
    enterText('example');

    expectFormTokenRequest();
  });

  it('adds form token header to submit requests', () => {
    const expectedToken = 'fake-token';
    enterText('example');
    expectFormTokenRequest(expectedToken);

    submitForm();

    expect(httpInterceptor.sendFormTokenOnNextRequest)
      .toHaveBeenCalledOnceWith(new FormToken(expectedToken));
  });

  function enterText(text: string) {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function expectNoFormTokenRequest() {
    httpTestingController.expectNone(
      'https://domain.tld/spa-form-token'
    );

    expect().nothing();
  }

  function expectFormTokenRequest(token = 'token-fake') {
    const request = httpTestingController.expectOne(
      'https://domain.tld/spa-form-token'
    );

    request.flush({}, {
      headers: { 'spa-form-token': token },
    });

    expect().nothing();
  }

  function submitForm() {
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }
});
