import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoAllocationComponent } from './auto-allocation.component';

const routes: Routes = [
  {
    path: '',
    component: AutoAllocationComponent,
    data: {
      permissions: {
        only: [ 'UpdateAutoAllocation'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutoAllocationRoutingModule { }
