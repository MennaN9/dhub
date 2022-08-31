import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkUploadShipmentDetailsRoutingModule } from './bulk-upload-shipment-details-routing.module';
import { BulkUploadShipmentDetailsComponent } from './bulk-upload-shipment-details.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { MatDividerModule } from '@angular/material/divider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';

@NgModule({
  declarations: [
    BulkUploadShipmentDetailsComponent,
    BulkUploadComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatDividerModule,
    NgxDropzoneModule,
    MatIconModule,
    MatPaginatorModule,
    LazyloadTranslateModule,
    BulkUploadShipmentDetailsRoutingModule,
    DateToTimezoneModule
  ],
  entryComponents: [
    BulkUploadComponent
  ]
})
export class BulkUploadShipmentDetailsModule { }
