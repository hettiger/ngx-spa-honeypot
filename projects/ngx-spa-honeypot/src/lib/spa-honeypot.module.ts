import { NgModule } from '@angular/core';
import { FormTokenDirective } from './form-token.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormTokenInterceptor } from './form-token.interceptor';

@NgModule({
  declarations: [
    FormTokenDirective,
  ],
  imports: [],
  providers: [
    FormTokenInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: FormTokenInterceptor,
      multi: true,
    },
  ],
  exports: [
    FormTokenDirective,
  ]
})
export class SpaHoneypotModule {}
