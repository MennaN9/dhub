import { TestBed } from '@angular/core/testing';

import { MainTaskTypeService } from './main-task-type.service';

describe('MainTaskTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainTaskTypeService = TestBed.get(MainTaskTypeService);
    expect(service).toBeTruthy();
  });
});
