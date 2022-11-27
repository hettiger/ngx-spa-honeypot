import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { AppTitleStrategy } from './app-title-strategy';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reactive-form'
  },
  {
    path: 'reactive-form',
    component: ReactiveFormComponent,
    title: 'Reactive Form'
  },
  {
    path: 'template-driven-form',
    component: TemplateDrivenFormComponent,
    title: 'Template Driven Form'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ]
})
export class AppRoutingModule { }
