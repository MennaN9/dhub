import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatIconModule, MatButtonModule, MatInputModule } from '@angular/material';
import { LazyloadTranslateModule } from '../../../shared/lazyload-translate/lazyload-translate.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [
    CommonModule,
    TermsAndConditionsRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,


    LazyloadTranslateModule,
    CKEditorModule,
  ]
})
export class TermsAndConditionsModule { }
