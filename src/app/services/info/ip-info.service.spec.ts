import { TestBed } from '@angular/core/testing';

import { IpInfoService } from './ip-info.service';

describe('IpInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpInfoService = TestBed.get(IpInfoService);
    expect(service).toBeTruthy();
  });
});
