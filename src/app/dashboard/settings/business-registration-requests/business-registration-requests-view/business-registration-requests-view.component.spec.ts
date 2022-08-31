import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRegistrationRequestsViewComponent } from './business-registration-requests-view.component';

describe('BusinessRegistrationRequestsViewComponent', () => {
  let component: BusinessRegistrationRequestsViewComponent;
  let fixture: ComponentFixture<BusinessRegistrationRequestsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRegistrationRequestsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRegistrationRequestsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
