import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessAccountsSettingsRoutingModule } from './business-accounts-settings-routing.module';
import { BusinessAccountsSettingsComponent } from './business-accounts-settings.component';


@NgModule({
  declarations: [BusinessAccountsSettingsComponent],
  imports: [
    CommonModule,
    BusinessAccountsSettingsRoutingModule
  ]
})
export class BusinessAccountsSettingsModule { }
