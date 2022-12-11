import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { SpaHoneypotModule } from '../../../ngx-spa-honeypot/src/lib/spa-honeypot.module';
import { TemplateDrivenFormComponent } from './components/template-driven-form/template-driven-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SPA_HONEYPOT_CONFIG, SpaHoneypotConfig } from '../../../ngx-spa-honeypot/src/lib/spa-honeypot.config';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpMessagesComponent } from './components/http-messages/http-messages.component';
import { HttpObserverInterceptor } from './services/http-observer/http-observer.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveFormComponent,
    TemplateDrivenFormComponent,
    HttpMessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SpaHoneypotModule,
    AppRoutingModule,
    ApolloModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ServiceWorkerModule.register('service-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    }),
  ],
  providers: [
    {
      provide: SPA_HONEYPOT_CONFIG,
      useFactory: (): SpaHoneypotConfig => ({
        domainTokenRoutePathMap: {
          'api.domain.tld': 'token'
        },
      }),
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.graphQLEndpoint,
          }),
        }
      },
      deps: [HttpLink]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpObserverInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
