import { TestBed } from '@angular/core/testing';

import { BusinessRegistrationRequestsService } from './business-registration-requests.service';

describe('BusinessRegistrationRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessRegistrationRequestsService = TestBed.get(BusinessRegistrationRequestsService);
    expect(service).toBeTruthy();
  });
});
