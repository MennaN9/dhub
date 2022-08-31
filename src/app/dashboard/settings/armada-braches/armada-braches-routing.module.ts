import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArmadaBrachesComponent } from './armada-braches/armada-braches.component';


const routes: Routes = [{
  path: '',
  component: ArmadaBrachesComponent,
  data: {
    permissions: {
      only: ['UpdateAutoAllocation'],
      redirectTo: '/'
    }
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArmadaBrachesRoutingModule { }
