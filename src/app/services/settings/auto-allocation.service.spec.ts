import { TestBed } from '@angular/core/testing';

import { AutoAllocationService } from './auto-allocation.service';

describe('AutoAllocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutoAllocationService = TestBed.get(AutoAllocationService);
    expect(service).toBeTruthy();
  });
});
