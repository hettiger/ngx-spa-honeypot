import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLModeService } from '../graphql-mode/graphql-mode.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mh-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.scss'],
})
export class TemplateDrivenFormComponent {

  action$: Observable<string>;

  constructor(
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

  onSubmit(action: string, value: any) {
    if (this.graphQLMode.active) {
      // TODO: Send GraphQL request
    } else {
      this.http.post(action, value).subscribe();
    }
  }

}
