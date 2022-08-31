import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchingManagersComponent } from './dispatching-managers.component';

const routes: Routes = [
  {
    path: '',
    component: DispatchingManagersComponent,
    data: {
      permissions: {
        only: ['AddManagerDispatching', 'UpdateManagerDispatching', 'ReadManagerDispatching', 'DeleteManagerDispatching'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchingManagersRoutingModule { }
