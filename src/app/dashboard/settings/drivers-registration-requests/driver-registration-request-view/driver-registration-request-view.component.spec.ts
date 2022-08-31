import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverRegistrationRequestViewComponent } from './driver-registration-request-view.component';

describe('DriverRegistrationRequestViewComponent', () => {
  let component: DriverRegistrationRequestViewComponent;
  let fixture: ComponentFixture<DriverRegistrationRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverRegistrationRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverRegistrationRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
