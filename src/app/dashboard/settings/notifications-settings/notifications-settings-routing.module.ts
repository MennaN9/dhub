import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsSettingsComponent } from './notifications-settings.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsSettingsRoutingModule { }
