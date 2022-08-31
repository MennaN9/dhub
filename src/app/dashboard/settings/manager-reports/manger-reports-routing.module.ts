import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerReportsComponent } from './manger-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerReportsRoutingModule { }
