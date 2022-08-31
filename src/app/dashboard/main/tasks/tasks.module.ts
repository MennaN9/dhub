import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksRoutingModule } from './tasks-routing.module';

// components
import { TasksComponent } from './tasks.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { QRCodeModule } from 'angular2-qrcode';

// angular material
import {
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatListModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatDividerModule,
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { EditTaskModule } from '../edit-task/edit-task.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TaskDetailsModule } from '../task-details/task-details.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ChangeTaskStatusModule } from '../change-task-status/change-task-status.module';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { AssignDriverModule } from '../assign-driver/assign-driver.module';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    TasksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    FlexLayoutModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatListModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    QRCodeModule,
    NgxBarcodeModule,

    // shared
    ConfirmDeletionModule,
    EditTaskModule,
    LazyloadTranslateModule,
    TaskDetailsModule,
    TruncateTextModule,
    ChangeTaskStatusModule,
    AssignDriverModule,
    SetDirModule,
    TranslateModule
  ],
  entryComponents: [
    TaskDetailsComponent,
    AssignDriverComponent,
  ]
})
export class TasksModule { }
