import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GraphQLModeService } from '../graphql-mode/graphql-mode.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mh-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss'],
})
export class ReactiveFormComponent {

  action$: Observable<string>;

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
    private graphQLMode: GraphQLModeService,
  ) {
    this.action$ = this.graphQLMode.active$.pipe(
      map(active => active
        ? 'https://api.domain.tld/graphql'
        : 'https://api.domain.tld/api/endpoint'
      ),
    );
  }

  onSubmit(action: string, value: typeof this.contactForm.value) {
    if (this.graphQLMode.active) {
      // TODO: Send GraphQL request
    } else {
      this.http.post(action, value).subscribe();
    }
  }

}
