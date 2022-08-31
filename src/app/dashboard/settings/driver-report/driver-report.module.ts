import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverReportComponent } from './driver-report.component';
import { DriverReportRoutingModule } from './driver-report-routing.module';

// material
import {
  MatTableModule,
  MatCheckboxModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [DriverReportComponent],
  imports: [
    CommonModule,
    DriverReportRoutingModule,


    // material
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    NgxPermissionsModule.forChild(),
    MatTooltipModule,
    DateTimePickerModule,

    LightboxModule,
    DateToTimezoneModule,
    LazyloadTranslateModule,
    TruncateTextModule,
    MatButtonToggleModule

  ]
})
export class DriverReportModule { }
