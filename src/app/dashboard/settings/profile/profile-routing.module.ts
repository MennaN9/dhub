import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { profileResolver } from '@dms/app/services/settings/profile/profile-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      userInfo: profileResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
