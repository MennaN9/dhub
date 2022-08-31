import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { RestaurantsComponent } from './restaurants.component';
import { ManageRestaurantComponent } from './manage-restaurant/manage-restaurant.component';
import { ManageBranchComponent } from './manage-branch/manage-branch.component';
import { BranchesComponent } from './branches/branches.component';
import { BlockRestaurantComponent } from './block-restaurant/block-restaurant.component';
import { BlockBranchComponent } from './block-branch/block-branch.component';

// material
import {
  MatButtonModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatFormFieldModule,
  MatIconModule,
  MatDialogModule,
  MatTableModule,
  MatAutocompleteModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';

// shared
import { CountryCodesModule } from '../../../shared/country-codes/country-codes.module';
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

import { NgxPermissionsModule } from 'ngx-permissions';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';
import { AddressModule } from '@dms/app/shared/address/address.module';
import { SearchPlaceModule } from '@dms/app/shared/search-place/search-place.module';
@NgModule({
  declarations: [
    RestaurantsComponent,
    ManageRestaurantComponent,
    ManageBranchComponent,
    BranchesComponent,
    BlockRestaurantComponent,
    BlockBranchComponent
  ],
  imports: [
    CommonModule,
    RestaurantsRoutingModule,
    ReactiveFormsModule,

    // material
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatTableModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDividerModule,

    // shared
    ConfirmDeletionModule,
    CountryCodesModule,
    LazyloadTranslateModule,
    SetDirModule,
    SearchPlaceModule,
    
    // plugins
    NgxPermissionsModule.forChild(),
    MatGoogleMapsAutocompleteModule,
    AddressModule
  ],
  entryComponents: [
    ManageRestaurantComponent,
    ManageBranchComponent,
    BlockRestaurantComponent,
    BlockBranchComponent
  ]
})
export class RestaurantsModule { }
