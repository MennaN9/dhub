import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateToTimezonePipe } from './date-to-timezone.pipe';

@NgModule({
  declarations: [
    DateToTimezonePipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
    DateToTimezonePipe
  ],
  exports: [
    DateToTimezonePipe
  ]
})
export class DateToTimezoneModule { }
