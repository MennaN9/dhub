import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsSettingsRoutingModule } from './notifications-settings-routing.module';
import { NotificationsSettingsComponent } from './notifications-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatTableModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NotificationsSettingsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    NotificationsSettingsRoutingModule
  ]
})
export class NotificationsSettingsModule { }
