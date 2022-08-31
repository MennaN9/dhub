import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPlaceComponent } from './search-place.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SearchPlaceComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    SearchPlaceComponent
  ]
})
export class SearchPlaceModule { }
