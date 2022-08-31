import { TestBed } from '@angular/core/testing';

import { BusinessRegistrationService } from './business-registration.service';

describe('BusinessRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessRegistrationService = TestBed.get(BusinessRegistrationService);
    expect(service).toBeTruthy();
  });
});
