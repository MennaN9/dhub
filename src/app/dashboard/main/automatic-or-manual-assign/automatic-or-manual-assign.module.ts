import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomaticOrManualAssignComponent } from './automatic-or-manual-assign.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule,
  MatFormFieldModule,
  MatListModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { TruncateTextModule } from '@dms/app/pipes/truncate-text/truncate-text.module';

@NgModule({
  declarations: [
    AutomaticOrManualAssignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    // material
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,

    // shared
    LazyloadTranslateModule,
    TruncateTextModule
  ],
  exports: [
    AutomaticOrManualAssignComponent
  ]
})
export class AutomaticOrManualAssignModule { }
