import { TestBed } from '@angular/core/testing';

import { TenantConfigurationService } from './tenant-configuration.service';

describe('TenantConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantConfigurationService = TestBed.get(TenantConfigurationService);
    expect(service).toBeTruthy();
  });
});
