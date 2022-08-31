import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutoAllocationRoutingModule } from './auto-allocation-routing.module';
import { AutoAllocationComponent } from './auto-allocation.component';

// material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule, MatProgressBarModule } from '@angular/material';

// shared
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [AutoAllocationComponent],
  imports: [
    CommonModule,
    AutoAllocationRoutingModule,

    // material
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressBarModule,
    DateToTimezoneModule,

    NgxPermissionsModule.forChild(),
    LazyloadTranslateModule,
  ]
})
export class AutoAllocationModule { }
