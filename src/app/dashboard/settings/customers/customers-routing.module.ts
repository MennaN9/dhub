import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CreateCustomer', 'UpdateCustomer', 'DeleteCustomer', 'ReadCustomer'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
