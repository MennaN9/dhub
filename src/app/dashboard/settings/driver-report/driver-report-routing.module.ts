import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverReportComponent } from './driver-report.component';

const routes: Routes = [
  {
    path: '',
    component: DriverReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverReportRoutingModule { }
