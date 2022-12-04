import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GraphQLModeService } from '../graphql-mode/graphql-mode.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { SEND_CONTACT_REQUEST } from '../graphql/send-contact-request';

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
    private apollo: Apollo,
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
      this.apollo.mutate({
        mutation: SEND_CONTACT_REQUEST,
        variables: {
          input: value,
        },
      }).subscribe();
    } else {
      this.http.post(action, value).subscribe();
    }
  }

}
