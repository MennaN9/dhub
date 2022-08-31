import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversLoginRequestsComponent } from './drivers-login-requests.component';

describe('DriversLoginRequestsComponent', () => {
  let component: DriversLoginRequestsComponent;
  let fixture: ComponentFixture<DriversLoginRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversLoginRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversLoginRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
