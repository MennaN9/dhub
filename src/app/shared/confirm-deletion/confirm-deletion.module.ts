import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDeletionComponent } from './confirm-deletion.component';
import { DialogOverview } from './confirm-deletion.component';

// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { LazyloadTranslateModule } from '../lazyload-translate/lazyload-translate.module';

@NgModule({
  declarations: [
    ConfirmDeletionComponent,
    DialogOverview
  ],
  imports: [
    CommonModule,

    // material
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    MatIconModule,
    LazyloadTranslateModule,
  ],
  exports: [
    ConfirmDeletionComponent,
  ],
  entryComponents: [
    DialogOverview
  ]
})
export class ConfirmDeletionModule { }
