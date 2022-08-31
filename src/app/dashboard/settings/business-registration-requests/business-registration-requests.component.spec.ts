import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRegistrationRequestsComponent } from './business-registration-requests.component';

describe('BusinessRegistrationRequestsComponent', () => {
  let component: BusinessRegistrationRequestsComponent;
  let fixture: ComponentFixture<BusinessRegistrationRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRegistrationRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
