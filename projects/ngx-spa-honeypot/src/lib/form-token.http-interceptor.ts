import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { hasHttpHeaders } from './predicates';
import { FormToken } from './form-token';

@Injectable()
export class FormTokenHttpInterceptor implements HttpInterceptor {

  /**
   * The form token that is used to manipulate the next request
   */
  protected formToken: null | FormToken = null;

  /**
   * Updates `this.formToken` so the provided `token` is used to manipulate the next request
   */
  sendFormTokenOnNextRequest(token: FormToken) {
    this.formToken = token;
  }

  /**
   * Adds a form token to the request when present;
   * updates the form token value using the response headers;
   * releases reference to the `FormToken` instance.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.formToken) {
      return next.handle(req);
    }

    const fromTokenRequest = req.clone({
      headers: req.headers.set('spa-form-token', this.formToken.use()),
    });

    return next.handle(fromTokenRequest).pipe(
      finalize(() => {
        this.releaseFormTokenInstance();
      }),
      catchError(error => {
        this.updateFormTokenValue(error);
        return throwError(error);
      }),
      tap(response => {
        this.updateFormTokenValue(response);
      }),
    );
  }

  /**
   * Releases the `this.formToken` reference
   *
   * Only one request should be manipulated after `this.sendFormTokenHeaderWithNextRequest()` has been called.
   * This interceptor manipulates all requests as long as it has a reference to a `FormToken`.
   * Therefore, some cleanup is required …
   */
  protected releaseFormTokenInstance() {
    this.formToken = null;
  }

  /**
   * Updates `this.formToken` using a new token from the given `response`
   *
   * Form token requests are always answered with a new form token in the response headers.
   * This allows for subsequent requests. (E.g. for subsequent attempts on server side validation errors.)
   */
  protected updateFormTokenValue(response: unknown) {
    if (hasHttpHeaders(response)) {
      this.formToken?.update(response.headers.get('spa-form-token'));
    }
  }

}
