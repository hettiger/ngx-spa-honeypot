import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLModeService } from '../graphql-mode/graphql-mode.service';

@Component({
  selector: 'mh-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.scss'],
})
export class TemplateDrivenFormComponent {

  constructor(
    private http: HttpClient,
    private graphQLMode: GraphQLModeService,
  ) {}

  onSubmit(action: string, value: any) {
    if (this.graphQLMode.active) {
      // TODO: Send GraphQL request
    } else {
      this.http.post(action, value).subscribe();
    }
  }

}
