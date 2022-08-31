import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';

// guards
import { AuthGuard } from '@dms/app/guards/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SettingsRoutingModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class SettingsModule { }
