import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    canActivate: [NgxPermissionsGuard],
    component: TeamsComponent,
    data: {
      permissions: {
        only: ['ReadMyTeam','CreateTeam', 'UpdateTeam', 'ReadTeam', 'DeleteTeam', 'UpdateAllTeam', 'DeleteAllTeam'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
