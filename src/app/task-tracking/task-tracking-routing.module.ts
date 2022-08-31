import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskTrackingComponent } from './task-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: TaskTrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskTrackingRoutingModule { }
