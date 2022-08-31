import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AccessControlRoutingModule } from './access-control-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// components
import { AccessControlComponent } from './access-control.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';

// material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { DateToTimezoneModule } from '@dms/pipes/date-to-timezone/date-to-timezone.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { SetDirModule } from '@dms/app/directives/set-dir/set-dir.module';

@NgModule({
  declarations: [
    AccessControlComponent,
    ManageRoleComponent
  ],
  imports: [
    CommonModule,
    AccessControlRoutingModule,

    // forms
    FormsModule,
    ReactiveFormsModule,

    //material 
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule,
    MatListModule,
    MatCardModule,
    FlexLayoutModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressBarModule,

    // shared
    ConfirmDeletionModule,
    DateToTimezoneModule,

    // plugins
    NgxPermissionsModule.forChild(),
    LazyloadTranslateModule,
    SetDirModule
  ],
  entryComponents: [
    ManageRoleComponent
  ]
})
export class AccessControlModule { }
