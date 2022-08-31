import { TestBed } from '@angular/core/testing';

import { ArmadaBranchesService } from './armada-branches.service';

describe('ArmadaBranchesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArmadaBranchesService = TestBed.get(ArmadaBranchesService);
    expect(service).toBeTruthy();
  });
});
