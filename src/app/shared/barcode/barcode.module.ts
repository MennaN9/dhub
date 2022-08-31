import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeComponent } from './barcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    BarcodeComponent
  ],
  imports: [
    CommonModule,
    NgxBarcodeModule,
    TranslateModule,
    MatDialogModule,

  ],
  exports: [
    BarcodeComponent
  ],
  entryComponents: [
    BarcodeComponent
  ]
})
export class BarcodeModule { }
