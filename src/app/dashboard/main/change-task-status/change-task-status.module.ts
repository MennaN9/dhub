import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeTaskStatusComponent } from './change-task-status.component';

import {
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatDividerModule
} from '@angular/material';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChangeTaskStatusComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,

    LazyloadTranslateModule,
  ],
  exports: [
    ChangeTaskStatusComponent
  ],
  entryComponents: [
    ChangeTaskStatusComponent
  ]
})
export class ChangeTaskStatusModule { }
