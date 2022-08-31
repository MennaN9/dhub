import { IndividualComponent } from './individual.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualRoutingModule } from './individual-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';

@NgModule({
  declarations: [IndividualComponent],
  imports: [
    CommonModule,
    IndividualRoutingModule,
    ReactiveFormsModule,
    LazyloadTranslateModule,
    CountryCodesModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,

  ]
})
export class IndividualModule { }
