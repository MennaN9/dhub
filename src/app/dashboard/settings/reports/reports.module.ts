import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
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
import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { OrderProgressModule } from './order-progress/order-progress.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,

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
    LazyloadTranslateModule,
    TruncateTextModule,
  ]
})
export class ReportsModule { }
