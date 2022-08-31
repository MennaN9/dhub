import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountLogsRoutingModule } from './account-logs-routing.module';
import { AccountLogsComponent } from './account-logs.component';

// angular material
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { NgxPermissionsModule } from 'ngx-permissions';

// shared
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccountLogsComponent],
  imports: [
    CommonModule,
    AccountLogsRoutingModule,

    //material
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    FlexLayoutModule,
    MatPaginatorModule,
    DateRangePickerModule,
    MatFormFieldModule,
    MatInputModule,
    DateToTimezoneModule,
    LazyloadTranslateModule,
    NgxPermissionsModule,
    FormsModule
  ]
})
export class AccountLogsModule { }
