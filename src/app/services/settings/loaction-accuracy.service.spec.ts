import { TestBed } from '@angular/core/testing';

import { LoactionAccuracyService } from './loaction-accuracy.service';

describe('LoactionAccuracyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoactionAccuracyService = TestBed.get(LoactionAccuracyService);
    expect(service).toBeTruthy();
  });
});
