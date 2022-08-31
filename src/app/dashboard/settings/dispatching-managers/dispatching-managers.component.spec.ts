import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchingManagersComponent } from './dispatching-managers.component';

describe('DispatchingManagersComponent', () => {
  let component: DispatchingManagersComponent;
  let fixture: ComponentFixture<DispatchingManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchingManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchingManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
