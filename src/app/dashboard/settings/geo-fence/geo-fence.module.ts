import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoFenceRoutingModule } from './geo-fence-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { GeoFenceComponent } from './geo-fence.component';
import { ManageGeoFenceComponent } from './manage-geo-fence/manage-geo-fence.component';

// material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material';

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
@NgModule({
  declarations: [
    GeoFenceComponent,
    ManageGeoFenceComponent],
  imports: [
    CommonModule,
    GeoFenceRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // material
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    ConfirmDeletionModule,
    DateToTimezoneModule,
    LazyloadTranslateModule,
    NgxPermissionsModule,
    NgxPermissionsModule.forChild(),
    SetDirModule,
  ]
})
export class GeoFenceModule { }
