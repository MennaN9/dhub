import { TestBed } from '@angular/core/testing';

import { DriverRegistrationRequestsService } from './driver-registration-requests.service';

describe('DriverRegistrationRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DriverRegistrationRequestsService = TestBed.get(DriverRegistrationRequestsService);
    expect(service).toBeTruthy();
  });
});
