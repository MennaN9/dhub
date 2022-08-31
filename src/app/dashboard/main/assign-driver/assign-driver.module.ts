import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignDriverComponent } from './assign-driver.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatSelectModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatCheckboxModule
} from '@angular/material';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AssignDriverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // material
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDividerModule,
    LazyloadTranslateModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    SetDirModule,
    TranslateModule
  ],
  exports: [
    AssignDriverComponent
  ],
  entryComponents: [
    AssignDriverComponent
  ]

})
export class AssignDriverModule { }
