import { TestBed } from '@angular/core/testing';

import { AgentTypeService } from './agent-type.service';

describe('AgentTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentTypeService = TestBed.get(AgentTypeService);
    expect(service).toBeTruthy();
  });
});
