import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BusinessRegistrationRequestsRoutingModule } from './business-registration-requests-routing.module';

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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

// shared
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AddressModule } from '@dms/app/shared/address/address.module';

import { BusinessRegistrationRequestsComponent } from './business-registration-requests.component';
import { BusinessRequestDetailsComponent } from './business-request-details/business-request-details.component';
import { RejectBusinessRequestComponent } from './reject-business-request/reject-business-request.component';
import { ApproveBusinessRequestComponent } from './approve-business-request/approve-business-request.component';
import { BusinessRegistrationRequestsViewComponent } from './business-registration-requests-view/business-registration-requests-view.component';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { DeliveryConfigurationViewComponent } from './delivery-company-configuration/delivery-configuration-view.component';
import { DynamicMatCheckboxModule } from '@dms/app/shared/dynamic-mat-checkbox/dynamic-mat-checkbox.module';


@NgModule({
  declarations: [
    BusinessRegistrationRequestsComponent,
    BusinessRequestDetailsComponent,
    RejectBusinessRequestComponent,
    ApproveBusinessRequestComponent,
    BusinessRegistrationRequestsViewComponent,
    DeliveryConfigurationViewComponent,

  ],
  imports: [
    CommonModule,
    BusinessRegistrationRequestsRoutingModule,
    ReactiveFormsModule, FormsModule,
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
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,

    LazyloadTranslateModule,
    CountryCodesModule,
    DateRangePickerModule,
    AddressModule,
    TruncateTextModule,
    DynamicMatCheckboxModule
  ],
  entryComponents: [
    ApproveBusinessRequestComponent,
    RejectBusinessRequestComponent,
  ]
})
export class BusinessRegistrationRequestsModule { }
