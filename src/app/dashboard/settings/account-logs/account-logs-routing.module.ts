import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLogsComponent } from './account-logs.component';

const routes: Routes = [
  {
    path: '',
    component: AccountLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountLogsRoutingModule { }
