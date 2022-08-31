import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverRoutingModule } from './driver-routing.module';

// components
import { DriverComponent } from './driver.component';
import { ChangeDriverTypeComponent } from './change-driver-type/change-driver-type.component';
import { ImportDriverComponent } from './import-driver/import-driver.component';

// angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { MatCheckboxModule } from '@angular/material';
import { ManageDriverModule } from './manage-driver/manage-driver.module';
import { ChangePasswordModule } from '@dms/app/shared/change-password/change-password.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

// forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    DriverComponent,
    ChangeDriverTypeComponent,
    ImportDriverComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    NgxDropzoneModule,

    // material
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FlexLayoutModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatListModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,

    // shared
    ConfirmDeletionModule,
    ManageDriverModule,
    ChangePasswordModule,

    FormsModule,
    ReactiveFormsModule,
    LazyloadTranslateModule,

    NgxPermissionsModule.forChild(),
  ],
  entryComponents: [
    ChangeDriverTypeComponent,
    ImportDriverComponent
  ]
})
export class DriverModule { }
