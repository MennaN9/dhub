import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { EditTaskComponent } from './edit-task.component';

// material
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatAutocompleteModule, MatRadioModule, MatDividerModule } from '@angular/material';
import { MatChipsModule } from '@angular/material/chips';

// shared
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';

// plugins
import { DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AutomaticOrManualAssignComponent } from '../automatic-or-manual-assign/automatic-or-manual-assign.component';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { AutomaticOrManualAssignModule } from '../automatic-or-manual-assign/automatic-or-manual-assign.module';
import { SearchPlaceModule } from '@dms/app/shared/search-place/search-place.module';


@NgModule({
  declarations: [
    EditTaskComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // material
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatRadioModule,
    MatDividerModule,

    // plugins
    DateTimePickerModule,
    SearchPlaceModule,
    
    // shared
    CountryCodesModule,
    LazyloadTranslateModule,
    MatGoogleMapsAutocompleteModule,
    AutomaticOrManualAssignModule
  ],
  exports: [
    EditTaskComponent
  ],
  entryComponents: [
    AutomaticOrManualAssignComponent
  ]
})
export class EditTaskModule { }
