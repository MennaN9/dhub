import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDriverComponent } from './manage-driver.component';

// angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule, MatDividerModule } from '@angular/material';

// forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// shared
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

// plugins
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@NgModule({
  declarations: [ManageDriverComponent],
  imports: [
    CommonModule,

    // material
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDividerModule,

    // forms
    FormsModule,
    ReactiveFormsModule,

    // shared
    CountryCodesModule,
    LazyloadTranslateModule,

    // plugins
    NgxTrimDirectiveModule
  ],
  exports: [
    ManageDriverComponent
  ],
  entryComponents: [
    ManageDriverComponent,
  ]
})
export class ManageDriverModule { }
