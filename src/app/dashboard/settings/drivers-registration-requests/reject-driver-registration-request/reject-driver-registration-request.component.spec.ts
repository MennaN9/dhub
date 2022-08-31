import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDriverRegistrationRequestComponent } from './reject-driver-registration-request.component';

describe('RejectDriverRegistrationRequestComponent', () => {
  let component: RejectDriverRegistrationRequestComponent;
  let fixture: ComponentFixture<RejectDriverRegistrationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectDriverRegistrationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectDriverRegistrationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
