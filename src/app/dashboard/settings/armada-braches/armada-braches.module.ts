import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArmadaBrachesRoutingModule } from './armada-braches-routing.module';
import { ArmadaBrachesComponent } from './armada-braches/armada-braches.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatChipsModule, MatDividerModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CountryCodesModule } from '../../../shared/country-codes/country-codes.module';
import { ConfirmDeletionModule } from '../../../shared/confirm-deletion/confirm-deletion.module';
import { LazyloadTranslateModule } from '../../../shared/lazyload-translate/lazyload-translate.module';


@NgModule({
  declarations: [ArmadaBrachesComponent],
  imports: [
    CommonModule,
    ArmadaBrachesRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,

    // shared
    CountryCodesModule,
    ConfirmDeletionModule,
    LazyloadTranslateModule,

  ]
})
export class ArmadaBrachesModule { }
