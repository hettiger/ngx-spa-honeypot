import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'mh-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent {

  contactForm = this.fb.group({
    honey: [null],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    subject: [null, Validators.required],
    message: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  onSubmit(action: string, value: typeof this.contactForm.value) {
    this.http.post(action, value).subscribe();
  }

}
