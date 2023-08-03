import { TestBed } from '@angular/core/testing';

import { DynamicUtilityService } from './dynamic-utility.service';

describe('DynamicUtilityService', () => {
  let service: DynamicUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
