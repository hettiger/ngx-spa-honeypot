import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mh-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.scss'],
})
export class TemplateDrivenFormComponent {

  constructor(
    private http: HttpClient,
  ) {}

  onSubmit(action: string, value: any) {
    this.http.post(action, value).subscribe();
  }

}

// TODO: Template is missing validation rules
