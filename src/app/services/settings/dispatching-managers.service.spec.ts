import { TestBed } from '@angular/core/testing';

import { DispatchingManagersService } from './dispatching-managers.service';

describe('DispatchingManagersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DispatchingManagersService = TestBed.get(DispatchingManagersService);
    expect(service).toBeTruthy();
  });
});
