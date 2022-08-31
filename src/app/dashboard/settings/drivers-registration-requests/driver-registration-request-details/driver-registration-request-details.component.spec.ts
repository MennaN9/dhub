import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRegistrationRequestDetailsComponent } from './driver-registration-request-details.component';

describe('DriverRegistrationRequestDetailsComponent', () => {
  let component: DriverRegistrationRequestDetailsComponent;
  let fixture: ComponentFixture<DriverRegistrationRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverRegistrationRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverRegistrationRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
