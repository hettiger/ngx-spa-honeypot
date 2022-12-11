import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { TemplateDrivenFormComponent } from './template-driven-form.component';
import { HttpMessagesComponent } from '../http-messages/http-messages.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('TemplateDrivenFormComponent', () => {
  let component: TemplateDrivenFormComponent;
  let fixture: ComponentFixture<TemplateDrivenFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemplateDrivenFormComponent,
        HttpMessagesComponent,
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDrivenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
