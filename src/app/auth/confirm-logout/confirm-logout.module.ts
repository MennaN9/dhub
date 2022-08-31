import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmLogoutComponent } from './confirm-logout.component';
import { MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmLogoutComponent],
  imports: [
    CommonModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ],
  exports: [
    ConfirmLogoutComponent
  ],
  entryComponents: [
    ConfirmLogoutComponent
  ]
})
export class ConfirmLogoutModule { }
