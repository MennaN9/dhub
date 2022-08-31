import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// components
import { MainComponent } from './main.component';
import { ManageTaskComponent } from './manage-task/manage-task.component';
import { DriversComponent } from './drivers/drivers.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { BlockDriverComponent } from './block-driver/block-driver.component';
import { ReassignDriverComponent } from './reassign-driver/reassign-driver.component';
import { AutomaticOrManualAssignComponent } from './automatic-or-manual-assign/automatic-or-manual-assign.component';
import { ReAssignTasksFromDriverComponent } from './re-assign-tasks-from-driver/re-assign-tasks-from-driver.component';

// material
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

// shared
import { CountryCodesModule } from '@dms/shared/country-codes/country-codes.module';
import { FilterModule } from '@dms/pipes/filter/filter.module';
import { ManageDriverModule } from '@dms/components/settings/driver/manage-driver/manage-driver.module';
import { EditTaskModule } from './edit-task/edit-task.module';

// shared
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { AssignDriverModule } from './assign-driver/assign-driver.module';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { AddressModule } from '@dms/app/shared/address/address.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TaskDetailsModule } from './task-details/task-details.module';
import { AutomaticOrManualAssignModule } from './automatic-or-manual-assign/automatic-or-manual-assign.module';
import { LightboxModule } from 'ngx-lightbox';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { MainMapComponent } from './main-map/main-map.component';
import { AgmCoreModule } from '@agm/core';
import { MatPaginatorModule } from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BarcodeModule } from '../../shared/barcode/barcode.module';
import { SearchPlaceModule } from '@dms/app/shared/search-place/search-place.module';

@NgModule({
  declarations: [
    MainComponent,
    ManageTaskComponent,
    DriversComponent,
    DriverDetailsComponent,
    BlockDriverComponent,
    ReassignDriverComponent,
    ReAssignTasksFromDriverComponent,
    MainMapComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    // material
    MatSidenavModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatRadioModule,
    MatListModule,
    FilterModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatPaginatorModule,

    // shared
    CountryCodesModule,
    ManageDriverModule,
    EditTaskModule,
    AssignDriverModule,
    DateToTimezoneModule,
    TaskDetailsModule,
    ConfirmDeletionModule,
    AutomaticOrManualAssignModule,
    TruncateTextModule,
    AddressModule,
    SetDirModule,
    NgxBarcodeModule,
    BarcodeModule,
    SearchPlaceModule,
    
    // plugins
    DateTimePickerModule,
    NgxPermissionsModule.forChild(),
    LightboxModule,
    AgmCoreModule,

    // ngx-translate and the loader module
    LazyloadTranslateModule,
    MatGoogleMapsAutocompleteModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    BlockDriverComponent,
    ReassignDriverComponent,
    AutomaticOrManualAssignComponent,
    ReAssignTasksFromDriverComponent,
  ]
})
export class MainModule { }
