import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BusinessRegistrationRoutingModule } from './business-registration-routing.module';
import { BusinessRegistrationComponent } from './business-registration.component';

// material
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { AddressModule } from '@dms/app/shared/address/address.module';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';

@NgModule({
  declarations: [BusinessRegistrationComponent],
  imports: [
    CommonModule,
    BusinessRegistrationRoutingModule,
    ReactiveFormsModule,
    LazyloadTranslateModule,

    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    AddressModule,
    CountryCodesModule,
    SetDirModule
  ]
})
export class BusinessRegistrationModule { }
