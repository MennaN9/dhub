import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTaskStatusComponent } from './change-task-status.component';

describe('ChangeTaskStatusComponent', () => {
  let component: ChangeTaskStatusComponent;
  let fixture: ComponentFixture<ChangeTaskStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTaskStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTaskStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
