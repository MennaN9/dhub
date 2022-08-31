import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersRoutingModule } from './customers-routing.module';

import { CustomersComponent } from './customers.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';

// angular material
import {
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatCardModule,
  MatMenuModule,
  MatTableModule,
  MatSelectModule,
  MatDividerModule,
  MatPaginatorModule,
  MatSortModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatListModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { SearchPlaceModule } from '@dms/app/shared/search-place/search-place.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
import { ImportCustomersComponent } from './import-customers/import-customers.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { AddressModule } from '@dms/app/shared/address/address.module';

@NgModule({
  declarations: [CustomersComponent, ManageCustomerComponent, ImportCustomersComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // material
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTooltipModule,

    // shared
    ConfirmDeletionModule,
    CountryCodesModule,
    NgxPermissionsModule.forChild(),
    LazyloadTranslateModule,
    NgxDropzoneModule,
    MatGoogleMapsAutocompleteModule,
    AddressModule,
    SearchPlaceModule
  ],
  entryComponents: [
    ManageCustomerComponent,
    ImportCustomersComponent
  ]
})
export class CustomersModule { }
