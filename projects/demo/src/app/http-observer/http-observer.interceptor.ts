import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, filter, Observable, Subject, takeUntil, map, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpObserverInterceptor implements HttpInterceptor {

  get messages$() {
    return this._messages$.pipe(
      map(messages => messages.map(
        ({ message, createdAt }) => ({
          type: message instanceof HttpRequest ? 'Request' : 'Response',
          createdAt,
          url: message.url,
          headers: message.headers.keys().map(
            header => `${header}: ${message.headers.getAll(header)?.join(', ')}`
          ).join('\n'),
          body: message.body,
        }),
      )),
    );
  }

  private _messages$ = new BehaviorSubject(new Array<{
    message: HttpRequest<any> | HttpResponse<any>,
    createdAt: Date,
  }>());

  private destroy$ = new Subject<true>();

  constructor(
    private router: Router,
  ) {
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(e => e instanceof NavigationEnd),
    ).subscribe(() => {
      this._messages$.next([]);
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.addMessage(request);

    return next.handle(request).pipe(
      tap(response => {
        if (response instanceof HttpResponse) {
          this.addMessage(response);
        }
      }),
    );
  }

  private addMessage(message: HttpRequest<any> | HttpResponse<any>) {
    const messages = this._messages$.getValue();
    messages.unshift({ message, createdAt: new Date });
    this._messages$.next(messages);
  }

}
