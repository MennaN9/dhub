import { TestBed } from '@angular/core/testing';

import { MainTaskService } from './main-task.service';

describe('MainTaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainTaskService = TestBed.get(MainTaskService);
    expect(service).toBeTruthy();
  });
});
