import { DeliveryConfigurationViewComponent } from './delivery-company-configuration/delivery-configuration-view.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessRegistrationRequestsComponent } from './business-registration-requests.component';
import { BusinessRequestDetailsComponent } from './business-request-details/business-request-details.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessRegistrationRequestsComponent
  },
  {
    path: 'view-details/:id',
    component: BusinessRequestDetailsComponent
  },
  {
    path: 'view-Delivery-configuration/:name/:id',
    component: DeliveryConfigurationViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRegistrationRequestsRoutingModule { }
