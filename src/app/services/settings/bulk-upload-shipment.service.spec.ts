import { TestBed } from '@angular/core/testing';

import { BulkUploadShipmentService } from './bulk-upload-shipment.service';

describe('BulkUploadShipmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulkUploadShipmentService = TestBed.get(BulkUploadShipmentService);
    expect(service).toBeTruthy();
  });
});
