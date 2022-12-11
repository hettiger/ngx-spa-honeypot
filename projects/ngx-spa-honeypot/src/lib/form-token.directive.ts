import { Directive, ElementRef, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { filter, fromEvent, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormTokenInterceptor } from './form-token.interceptor';
import { HttpClient } from '@angular/common/http';
import { hasHttpHeaders } from './predicates';
import { FormToken } from './form-token';
import { SPA_HONEYPOT_CONFIG, SpaHoneypotConfig } from './spa-honeypot.config';

@Directive({
  selector: 'form[action]'
})
export class FormTokenDirective implements OnInit, OnDestroy {

  protected get action() {
    return this.formElement.nativeElement.action;
  }

  protected get form() {
    return this.formGroup || this.ngForm?.form;
  }

  protected readonly formToken = new FormToken();

  protected submit$: Observable<SubmitEvent>;
  protected unsubscribe$ = new Subject<boolean>();

  constructor(
    protected formElement: ElementRef<HTMLFormElement>,
    protected http: HttpClient,
    protected httpInterceptor: FormTokenInterceptor,
    @Optional() protected formGroup?: FormGroupDirective,
    @Optional() protected ngForm?: NgForm,
    @Optional() @Inject(SPA_HONEYPOT_CONFIG) protected config?: SpaHoneypotConfig,
  ) {
    this.submit$ = fromEvent<SubmitEvent>(
      formElement.nativeElement,
      'submit',
      { capture: true }, // The `capture` option makes sure we can intercept before `ngSubmit` does fire.
    );
  }

  ngOnInit(): void {
    this.form?.valueChanges?.pipe(
      takeUntil(this.unsubscribe$),
      filter(
        // Angular may initialize control values with empty strings.
        // It emits one `valueChanges` event per initialized control.
        // These events are not a result of user interaction.
        // Therefore, they must be discarded.
        formValue => Object.values(formValue).some(controlValue => controlValue !== '')
      ),
      take(1),
    ).subscribe(this.requestFormToken.bind(this));

    this.submit$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(this.sendFormTokenOnNextRequest.bind(this));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  protected requestFormToken() {
    const action = new URL(this.action);
    action.search = '';
    action.hash = '';
    action.pathname = (this.config?.domainTokenRoutePathMap || {})[action.hostname] ?? 'spa-form-token';

    this.http.post(action.href, {}, {
      headers: { 'spa-form-token': '' },
      observe: 'response'
    }).subscribe({
      next: this.updateFormToken.bind(this),
      error: this.updateFormToken.bind(this),
    });
  }

  protected updateFormToken(response: unknown) {
    if (hasHttpHeaders(response)) {
      this.formToken.update(response.headers.get('spa-form-token'));
    }
  }

  protected sendFormTokenOnNextRequest() {
    this.httpInterceptor.sendFormTokenOnNextRequest(this.formToken);
  }

}
