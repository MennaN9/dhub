import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderProgressComponent } from './order-progress.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LightboxModule } from 'ngx-lightbox';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';

@NgModule({
  declarations: [OrderProgressComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    LightboxModule,
    LazyloadTranslateModule,
    DateToTimezoneModule
  ],
  exports: [
    OrderProgressComponent
  ],
  entryComponents: [
    OrderProgressComponent
  ]
})
export class OrderProgressModule { }
