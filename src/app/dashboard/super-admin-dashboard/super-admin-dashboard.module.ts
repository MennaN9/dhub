import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SuperAdminDashboardRoutingModule } from './super-admin-dashboard-routing.module';
import { SuperAdminDashboardComponent } from './super-admin-dashboard.component';

// material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TranslateModule } from '@ngx-translate/core';

// shared
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';
import { AssignDriverModule } from '../main/assign-driver/assign-driver.module';

@NgModule({
  declarations: [SuperAdminDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SuperAdminDashboardRoutingModule,

    // material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,

    DateRangePickerModule,
    TranslateModule,
    SetDirModule,
    AssignDriverModule
  ]
})
export class SuperAdminDashboardModule { }
