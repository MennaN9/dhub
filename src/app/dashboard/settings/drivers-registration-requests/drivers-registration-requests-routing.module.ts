import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriversRegistrationRequestsComponent } from './drivers-registration-requests.component';
import { DriverRegistrationRequestDetailsComponent } from './driver-registration-request-details/driver-registration-request-details.component';
const routes: Routes = [
  {
    path: '',
    component: DriversRegistrationRequestsComponent
  },
  {
    path: 'view-details/:id',
    component: DriverRegistrationRequestDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRegistrationRequestsRoutingModule { }
