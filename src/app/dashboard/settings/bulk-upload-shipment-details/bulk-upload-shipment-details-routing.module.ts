import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkUploadShipmentDetailsComponent } from './bulk-upload-shipment-details.component';

const routes: Routes = [
  {
    path: '',
    component: BulkUploadShipmentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkUploadShipmentDetailsRoutingModule { }
