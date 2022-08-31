import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantsComponent } from './restaurants.component';
import { BranchesComponent } from './branches/branches.component';

const routes: Routes = [
  {
    path: '',
    component: RestaurantsComponent,
    data: {
      permissions: {
        only: ['AddRestaurant', 'UpdateRestaurant', 'DeleteRestaurant'],
        redirectTo: '/'
      }
    }
  },
  {
    path: ':id/branches',
    component: BranchesComponent,

    data: {
      permissions: {
        only: ['AddBranch', 'DeleteBranch', 'UpdateBranch'],
        redirectTo: '/'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantsRoutingModule { }
