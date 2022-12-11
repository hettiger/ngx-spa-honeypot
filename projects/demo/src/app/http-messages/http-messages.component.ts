import { Component, OnInit } from '@angular/core';
import { HttpObserverInterceptor } from '../http-observer/http-observer.interceptor';

@Component({
  selector: 'mh-http-messages',
  templateUrl: './http-messages.component.html',
  styleUrls: ['./http-messages.component.scss'],
})
export class HttpMessagesComponent implements OnInit {

  messages$ = this.httpObserver.messages$;

  constructor(
    private httpObserver: HttpObserverInterceptor,
  ) {}

  ngOnInit(): void {
  }

}
