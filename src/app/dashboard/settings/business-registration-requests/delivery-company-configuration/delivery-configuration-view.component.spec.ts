import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryConfigurationViewComponent } from './delivery-configuration-view.component';

describe('DeliveryConfigurationViewComponent', () => {
  let component: DeliveryConfigurationViewComponent;
  let fixture: ComponentFixture<DeliveryConfigurationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryConfigurationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryConfigurationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
