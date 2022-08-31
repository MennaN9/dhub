import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateCustomerComponent } from './rate-customer.component';

const routes: Routes = [
  {
    path: '',
    component: RateCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCustomerRoutingModule { }
