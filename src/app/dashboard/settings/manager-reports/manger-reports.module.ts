import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


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
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { ManagerReportsRoutingModule } from './manger-reports-routing.module';
import { ManagerReportsComponent } from './manger-reports.component';
import { OrderProgressModule } from '../reports/order-progress/order-progress.module';

@NgModule({
  declarations: [ManagerReportsComponent],
  imports: [
    CommonModule,
    ManagerReportsRoutingModule,

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
    OrderProgressModule,
    DateToTimezoneModule,
    LazyloadTranslateModule,
    TruncateTextModule,
  ],
  entryComponents: [

  ]
})
export class ManagerReportsModule { }
