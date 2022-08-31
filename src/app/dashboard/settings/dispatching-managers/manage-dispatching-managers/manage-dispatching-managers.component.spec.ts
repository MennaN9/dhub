import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDispatchingManagersComponent } from './manage-dispatching-managers.component';

describe('ManageDispatchingManagersComponent', () => {
  let component: ManageDispatchingManagersComponent;
  let fixture: ComponentFixture<ManageDispatchingManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDispatchingManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDispatchingManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
