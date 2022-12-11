import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { ReactiveFormComponent } from './reactive-form.component';
import { HttpMessagesComponent } from '../http-messages/http-messages.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('ReactiveFormComponent', () => {
  let component: ReactiveFormComponent;
  let fixture: ComponentFixture<ReactiveFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReactiveFormComponent,
        HttpMessagesComponent,
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
