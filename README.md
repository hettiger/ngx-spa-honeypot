# @hettiger/ngx-spa-honeypot

Angular Frontend Companion Library for the Laravel PHP package [hettiger/spa-honeypot](https://github.com/hettiger/spa-honeypot).

> This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Development server (Demo Application)

Run `ng serve demo` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

> Don't run `ng build` manually. There are additional pre- and post-build-steps involved.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Publish

Run `npm run publish` to build and publish the project.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Configuration

Without any customization on the backend configuration can be skipped entirely.
However, a configuration may be required when customization takes place.
Apply your configuration as follows:

```typescript
import { SPA_HONEYPOT_CONFIG, SpaHoneypotConfig } from 'ngx-spa-honeypot';

@NgModule({
  providers: [
    {
      provide: SPA_HONEYPOT_CONFIG,
      useFactory: (): SpaHoneypotConfig => ({
        domainTokenRoutePathMap: {
          'api.domain.tld': 'token',
        },
      }),
    },
  ],
  // …
})
export class AppModule {}
```

> See `SpaHoneypotConfig` for documentation on individual configuration values. 

## Honeypot Input Field

There are numerous ways to add a honeypot field which is actually a good thing.
This package does not try to provide a one size fits all solution because bots could easily optimize for that.
Instead, you should simply add your honeypot fields exactly the same way that you would add any other form field.
However, there are some things to consider:

- Hide your honeypot field in a non-obvious way (e.g. repositioning via `first-child` CSS selector)
- Add the `tabindex="-1"` attribute so users don't navigate to the honeypot field using the `Tab` key
- Add the `autocomplete="off"` attribute when applicable so browsers don't fill out the honeypot field

## Time Based Anti SPAM Protection

Time based anti SPAM protection relies on a custom HTTP header that needs to be sent with each form request.
This package uses a directive and an HTTP interceptor to make this as convenient as possible.
Simply add the `action` attribute to each form element that should be protected:

```angular2html
<form
  action="https://api.domain.tld/api/endpoint" 
  novalidate
  (ngSubmit)="onSubmit()"
>
    <!-- Form Controls … -->
</form>
```

> Don't forget to protect the API endpoint using the `form` or `form.token` middleware.
> (Or using the `@requireFormToken` directive when you're calling a Lighthouse GraphQL API.)
