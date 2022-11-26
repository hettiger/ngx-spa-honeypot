import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { fromEvent, Observable, Subject, take, takeUntil } from 'rxjs';
import { FormTokenHttpInterceptor } from './form-token.http-interceptor';

@Directive({
  selector: 'form'
})
export class FormTokenDirective implements OnInit, OnDestroy {

  protected formToken: null | string = null;

  protected submit$: Observable<SubmitEvent>;
  protected unsubscribe$ = new Subject<boolean>();

  constructor(
    protected formGroup: FormGroupDirective,
    protected el: ElementRef<HTMLFormElement>,
    protected httpInterceptor: FormTokenHttpInterceptor,
  ) {
    this.submit$ = fromEvent<SubmitEvent>(
      this.el.nativeElement,
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
    this.formToken = 'form-token-fake';
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
