import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateCustomerRoutingModule } from './rate-customer-routing.module';

// components
import { RateCustomerComponent } from './rate-customer.component';

// material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatButtonModule, MatTooltipModule } from '@angular/material';

import { ReactiveFormsModule } from "@angular/forms";
import { StarRatingModule } from '../shared/star-rating/star-rating.module';
import { LazyloadTranslateModule } from '../shared/lazyload-translate/lazyload-translate.module';

@NgModule({
  declarations: [RateCustomerComponent],
  imports: [
    CommonModule,
    RateCustomerRoutingModule,

    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,

    ReactiveFormsModule,
    StarRatingModule,
    LazyloadTranslateModule
  ]
})
export class RateCustomerModule { }
