import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details.component';

import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { LightboxModule } from 'ngx-lightbox';
import { StarRatingModule } from '@dms/app/shared/star-rating/star-rating.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';
import { ChangeTaskStatusModule } from '../change-task-status/change-task-status.module';

@NgModule({
  declarations: [TaskDetailsComponent],
  imports: [
    CommonModule,

    NgxPermissionsModule,
    LightboxModule,

    // shared 
    LazyloadTranslateModule,
    DateToTimezoneModule,
    ConfirmDeletionModule,
    StarRatingModule,
    ChangeTaskStatusModule,

    // material
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatDialogModule,
    TruncateTextModule,
  ],
  exports: [
    TaskDetailsComponent,
  ],
  entryComponents: [
    EditTaskComponent
  ]
})
export class TaskDetailsModule { }
