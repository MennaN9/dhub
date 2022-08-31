import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessAccountsSettingsComponent } from './business-accounts-settings.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessAccountsSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessAccountsSettingsRoutingModule { }
