import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { FilterModule } from '@dms/pipes/filter/filter.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';

@NgModule({
  declarations: [AddressComponent],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    LazyloadTranslateModule,
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    FilterModule,
    SetDirModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    AddressComponent
  ]
})
export class AddressModule { }
