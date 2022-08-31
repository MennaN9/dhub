import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCustomerComponent } from './rate-customer.component';

describe('RateCustomerComponent', () => {
  let component: RateCustomerComponent;
  let fixture: ComponentFixture<RateCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
