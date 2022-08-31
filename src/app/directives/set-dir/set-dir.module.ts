import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetDirDirective } from './set-dir.directive';

@NgModule({
  declarations: [
    SetDirDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SetDirDirective
  ]
})
export class SetDirModule { }
