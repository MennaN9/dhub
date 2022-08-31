import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicMatCheckboxComponent } from './dynamic-mat-checkbox.component';


@NgModule({
  declarations: [DynamicMatCheckboxComponent],
  imports: [
    CommonModule,
    MatCheckboxModule
  ],
  exports: [DynamicMatCheckboxComponent]
})
export class DynamicMatCheckboxModule { }
