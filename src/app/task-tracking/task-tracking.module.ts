import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskTrackingRoutingModule } from './task-tracking-routing.module';
import { TaskTrackingComponent } from './task-tracking.component';
import { AgmCoreModule } from '@agm/core'
import { AgmDirectionModule } from 'agm-direction'
import { MatCardModule } from '@angular/material/card';

// shared
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

@NgModule({
  declarations: [TaskTrackingComponent],
  imports: [
    CommonModule,
    TaskTrackingRoutingModule,
    MatCardModule,

    AgmCoreModule,
    AgmDirectionModule.forChild(),
    LazyloadTranslateModule,
  ]
})
export class TaskTrackingModule { }
