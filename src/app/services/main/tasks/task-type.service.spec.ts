import { TestBed } from '@angular/core/testing';

import { TaskTypeService } from './task-type.service';

describe('TaskTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskTypeService = TestBed.get(TaskTypeService);
    expect(service).toBeTruthy();
  });
});
