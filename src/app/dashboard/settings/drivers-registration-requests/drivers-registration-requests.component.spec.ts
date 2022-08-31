import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversRegistrationRequestsComponent } from './drivers-registration-requests.component';

describe('DriversRegistrationRequestsComponent', () => {
  let component: DriversRegistrationRequestsComponent;
  let fixture: ComponentFixture<DriversRegistrationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversRegistrationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversRegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
