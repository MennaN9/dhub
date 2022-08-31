import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating.component';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatTooltipModule } from '@angular/material';

@NgModule({
  declarations: [
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  exports: [
    StarRatingComponent
  ]
})
export class StarRatingModule { }
