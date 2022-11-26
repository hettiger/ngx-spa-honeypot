import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';

type NextFormTokenCallback = (token: null | string) => void;

@Injectable()
export class FormTokenHttpInterceptor implements HttpInterceptor {

  /**
   * The form token that should be sent together with the next request
   */
  protected formToken: null | string = null;

  /**
   * Stores new form token in the `FormTokenDirective.formToken` property
   *
   * A form token is valid only once. => A subsequent request needs a new form token.
   * Form token requests are answered with a new token automatically.
   */
  protected nextFormToken: null | NextFormTokenCallback = null;

  /**
   * Sets a form token that will be sent with the next request;
   * registers a callback to communicate back the next form token.
   */
  setFormToken(token: string, next: NextFormTokenCallback) {
    this.formToken = token;
    this.nextFormToken = next;
  }

  /**
   * Resets interceptor to be ready for the next request
   */
  reset() {
    this.formToken = null;
    this.nextFormToken = null;
  }

  /**
   * Adds a form token to the request when present;
   * communicates back the next form token.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.formToken) {
      return next.handle(req);
    }

    const fromTokenRequest = req.clone({
      headers: req.headers.set('spa-form-token', this.formToken),
    });

    return next.handle(fromTokenRequest).pipe(
      finalize(() => {
        this.reset();
      }),
      tap(response => {
        if (response instanceof HttpResponse && this.nextFormToken) {
          this.nextFormToken(response.headers.get('spa-form-token'));
        }
      }),
    );
  }

}
