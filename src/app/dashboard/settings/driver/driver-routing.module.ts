import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverComponent } from './driver.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: DriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CreateAgent', 'UpdateAgent', 'DeleteAgent', 'DeleteAllAgent', 'UpdateAllAgent', 'ReadAgent'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
