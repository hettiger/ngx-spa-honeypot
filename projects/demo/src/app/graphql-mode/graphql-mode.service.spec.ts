import { TestBed } from '@angular/core/testing';

import { GraphQLModeService } from './graphql-mode.service';

describe('GraphQLModeService', () => {
  let service: GraphQLModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphQLModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
