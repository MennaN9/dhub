import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DriversRegistrationRequestsRoutingModule } from './drivers-registration-requests-routing.module';
import { DriversRegistrationRequestsComponent } from './drivers-registration-requests.component';
import { DriverRegistrationRequestDetailsComponent } from './driver-registration-request-details/driver-registration-request-details.component';
import { CompleteDriverProfileComponent } from './complete-driver-profile/complete-driver-profile.component';
import { RejectDriverRegistrationRequestComponent } from './reject-driver-registration-request/reject-driver-registration-request.component';

// material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { StarRatingModule } from '@dms/app/shared/star-rating/star-rating.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';

// shared
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { DriverRegistrationRequestViewComponent } from './driver-registration-request-view/driver-registration-request-view.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FilterModule } from '@dms/pipes/filter/filter.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [
    DriversRegistrationRequestsComponent,
    DriverRegistrationRequestDetailsComponent,
    CompleteDriverProfileComponent,
    RejectDriverRegistrationRequestComponent,
    DriverRegistrationRequestViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DriversRegistrationRequestsRoutingModule,

    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    StarRatingModule,
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatChipsModule,
    FlexLayoutModule,

    LazyloadTranslateModule,
    CountryCodesModule,
    DateRangePickerModule,
    NgxMatSelectSearchModule,
    FilterModule,
    LightboxModule
  ],
  entryComponents: [
    CompleteDriverProfileComponent,
    RejectDriverRegistrationRequestComponent
  ]
})
export class DriversRegistrationRequestsModule { }
