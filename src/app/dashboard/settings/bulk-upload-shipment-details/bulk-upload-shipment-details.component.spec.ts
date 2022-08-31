import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadShipmentDetailsComponent } from './bulk-upload-shipment-details.component';

describe('BulkUploadShipmentDetailsComponent', () => {
  let component: BulkUploadShipmentDetailsComponent;
  let fixture: ComponentFixture<BulkUploadShipmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadShipmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadShipmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
