import { TestBed } from '@angular/core/testing';

import { TransportTypeService } from './transport-type.service';

describe('TransportTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransportTypeService = TestBed.get(TransportTypeService);
    expect(service).toBeTruthy();
  });
});
