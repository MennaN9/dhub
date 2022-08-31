import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { ManageManagerComponent } from './manage-manager/manage-manager.component';


// angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { CountryCodesModule } from '../../../shared/country-codes/country-codes.module';
import { ChangePasswordModule } from '@dms/app/shared/change-password/change-password.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    ManagerComponent,
    ManageManagerComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,

    // material
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatAutocompleteModule,

    FormsModule,
    ReactiveFormsModule,

    // shared
    ConfirmDeletionModule,
    CountryCodesModule,
    ChangePasswordModule,
    NgxPermissionsModule,
    LazyloadTranslateModule,
    NgxPermissionsModule.forChild()
  ],
  entryComponents: [
    ManageManagerComponent
  ]
})
export class ManagerModule { }
