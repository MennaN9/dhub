import { TestBed } from '@angular/core/testing';

import { DriverTermsAndConditionsService } from './driver-terms-and-conditions.service';

describe('DriverTermsAndConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriverTermsAndConditionsService = TestBed.get(DriverTermsAndConditionsService);
    expect(service).toBeTruthy();
  });
});
