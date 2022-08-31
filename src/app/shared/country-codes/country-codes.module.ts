import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// components
import { CountryCodesComponent } from './country-codes.component';

// material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { CountryNamesComponent } from '../countries-names/country-names.component';


@NgModule({
  declarations: [
    CountryCodesComponent,
    CountryNamesComponent
  ],
  imports: [
    CommonModule,

    // forms
    ReactiveFormsModule,
    FormsModule,

    // material
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    CountryCodesComponent,
    CountryNamesComponent
  ]
})
export class CountryCodesModule { }
