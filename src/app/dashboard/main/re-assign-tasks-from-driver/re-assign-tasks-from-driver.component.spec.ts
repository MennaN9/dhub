import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignTasksFromDriverComponent } from './re-assign-tasks-from-driver.component';

describe('ReAssignTasksFromDriverComponent', () => {
  let component: ReAssignTasksFromDriverComponent;
  let fixture: ComponentFixture<ReAssignTasksFromDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReAssignTasksFromDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignTasksFromDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
