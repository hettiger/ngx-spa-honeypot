import { Directive, ElementRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { fromEvent, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormTokenHttpInterceptor } from './form-token.http-interceptor';
import { HttpClient } from '@angular/common/http';
import { hasHttpHeaders } from './predicates';
import { FormToken } from './form-token';

@Directive({
  selector: 'form[action]'
})
export class FormTokenDirective implements OnInit, OnDestroy {

  protected get method() {
    return this.formElement.nativeElement.method || 'post';
  }

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
    protected httpInterceptor: FormTokenHttpInterceptor,
    @Optional() protected formGroup?: FormGroupDirective,
    @Optional() protected ngForm?: NgForm,
  ) {
    this.submit$ = fromEvent<SubmitEvent>(
      formElement.nativeElement,
      'submit',
      { capture: true }, // capture makes sure we can intercept before `ngSubmit` does fire
    );
  }

  ngOnInit(): void {
    this.form?.valueChanges?.pipe(
      takeUntil(this.unsubscribe$),
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
    this.http.request(this.method, this.action, {
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
    this.httpInterceptor.sendFormTokenHeaderWithNextRequest(this.formToken);
  }

}
