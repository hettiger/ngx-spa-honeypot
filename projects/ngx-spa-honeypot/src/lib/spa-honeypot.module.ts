import { NgModule } from '@angular/core';
import { FormTokenDirective } from './form-token.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormTokenHttpInterceptor } from './form-token.http-interceptor';

@NgModule({
  declarations: [
    FormTokenDirective,
  ],
  imports: [],
  providers: [
    FormTokenHttpInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: FormTokenHttpInterceptor,
      multi: true,
    },
  ],
  exports: [
    FormTokenDirective,
  ]
})
export class SpaHoneypotModule {}
