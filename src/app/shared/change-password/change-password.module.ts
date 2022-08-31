import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChangePasswordComponent,
  ChangePasswordDialogComponent
} from './change-password.component';
import { MatCardModule } from '@angular/material/card';
import {
  MatInputModule,
  MatIconModule,
  MatDividerModule,
  MatDialogModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyloadTranslateModule } from '../lazyload-translate/lazyload-translate.module';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ChangePasswordDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,

    MatCardModule,
    MatInputModule,
    LazyloadTranslateModule,
  ],
  entryComponents: [
    ChangePasswordDialogComponent
  ],
  exports: [
    ChangePasswordComponent
  ]
})
export class ChangePasswordModule { }
