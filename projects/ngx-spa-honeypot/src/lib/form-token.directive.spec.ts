import { FormTokenDirective } from './form-token.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpaHoneypotModule } from './spa-honeypot.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  beforeEach(waitForAsync(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      imports: [ SpaHoneypotModule, FormsModule, HttpClientTestingModule ],
    })
    .createComponent(TestComponent);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    formDebugElement = fixture.debugElement.query(By.directive(FormTokenDirective));
    form = formDebugElement.nativeElement;
    inputDebugElement = formDebugElement.query(By.css('input'));
    input = inputDebugElement.nativeElement;
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('does not request initial form token until first input', () => {
    expect().nothing();
  });

  it('requests initial form token on first input', () => {
    enterText('example');

    expectFormTokenRequest();
  });

  it('adds form token header to submit requests', () => {
    const expectedToken = 'fake-token';

    enterText('example');

    expectFormTokenRequest({
      responseToken: expectedToken,
    });

    submitForm(form.action);

    expectFormTokenRequest({
      url: form.action,
      requestToken: expectedToken,
    });
  });

  it('uses fresh form token on subsequent requests', () => {
    const expectedInitialToken = 'fake-token';
    const expectedSubsequentToken = 'subsequent-fake-token';

    enterText('example');

    expectFormTokenRequest({
      responseToken: expectedInitialToken,
    });

    submitForm(form.action);

    expectFormTokenRequest({
      url: form.action,
      requestToken: expectedInitialToken,
      responseToken: expectedSubsequentToken,
    });

    submitForm(form.action);

    expectFormTokenRequest({
      url: form.action,
      requestToken: expectedSubsequentToken,
    });
  });

  it('is self-healing', () => {
    const expectedToken = 'fake-token';

    submitForm(form.action);

    expectFormTokenRequest({
      url: form.action,
      requestToken: '',
      responseToken: expectedToken,
    });

    submitForm(form.action);

    expectFormTokenRequest({
      url: form.action,
      requestToken: expectedToken,
    });
  });

  function enterText(text: string) {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function expectFormTokenRequest({
    url = 'https://domain.tld/spa-form-token',
    requestToken = '',
    responseToken = 'form-token-fake',
  } = {}) {
    const request = httpTestingController.expectOne(
      req => {
        expect(req.url).toBe(url);
        expect(req.headers.get('spa-form-token')).toBe(requestToken);

        return true;
      }
    );

    request.flush({}, {
      headers: { 'spa-form-token': responseToken },
    });
  }

  function submitForm(url: string) {
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    httpClient.post(url, {}).subscribe();
  }
});
