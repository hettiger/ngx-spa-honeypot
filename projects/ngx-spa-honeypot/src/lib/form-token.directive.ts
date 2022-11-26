import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { fromEvent, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormTokenHttpInterceptor } from './form-token.http-interceptor';
import { HttpClient } from '@angular/common/http';
import { hasHttpHeaders } from './predicates';

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

  protected formToken: null | string = null;

  protected submit$: Observable<SubmitEvent>;
  protected unsubscribe$ = new Subject<boolean>();

  constructor(
    protected formElement: ElementRef<HTMLFormElement>,
    protected formGroup: FormGroupDirective,
    protected http: HttpClient,
    protected httpInterceptor: FormTokenHttpInterceptor,
  ) {
    this.submit$ = fromEvent<SubmitEvent>(
      formElement.nativeElement,
      'submit',
      { capture: true }, // capture makes sure we can intercept before `ngSubmit` does fire
    );
  }

  ngOnInit(): void {
    this.formGroup.valueChanges?.pipe(
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
      next: this.setFormToken.bind(this),
      error: this.setFormToken.bind(this),
    });
  }

  protected setFormToken(response: unknown) {
    if (hasHttpHeaders(response)) {
      this.formToken = response.headers.get('spa-form-token');
    }
  }

  protected sendFormTokenOnNextRequest() {
    if (this.formToken) {
      this.httpInterceptor.setFormToken(
        this.formToken,
        token => this.formToken = token,
      );
    }
  }

}
