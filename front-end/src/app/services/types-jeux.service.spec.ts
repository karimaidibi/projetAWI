import { TestBed } from '@angular/core/testing';

import { TypesJeuxService } from './types-jeux.service';

describe('TypesJeuxService', () => {
  let service: TypesJeuxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesJeuxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
