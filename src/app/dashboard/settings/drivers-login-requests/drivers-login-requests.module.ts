import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DriversLoginRequestsRoutingModule } from "./drivers-login-requests-routing.module";
import { DriversLoginRequestsComponent } from "./drivers-login-requests.component";

// material
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import {
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateToTimezoneModule } from "@dms/app/pipes/date-to-timezone/date-to-timezone.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CancelReasonTypeComponent } from "./cancel-reason-type.component/cancel-reason-type.component";
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [DriversLoginRequestsComponent, CancelReasonTypeComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    DriversLoginRequestsRoutingModule,
    FormsModule, ReactiveFormsModule,
    LazyloadTranslateModule,
    DateToTimezoneModule,
    MatTooltipModule,
    DateTimePickerModule
  ],
})
export class DriversLoginRequestsModule { }
