import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRequestDetailsComponent } from './business-request-details.component';

describe('BusinessRequestDetailsComponent', () => {
  let component: BusinessRequestDetailsComponent;
  let fixture: ComponentFixture<BusinessRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
