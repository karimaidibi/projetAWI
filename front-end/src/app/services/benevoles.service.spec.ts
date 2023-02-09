import { TestBed } from '@angular/core/testing';

import { BenevolesService } from './benevoles.service';

describe('BenevolesService', () => {
  let service: BenevolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenevolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
