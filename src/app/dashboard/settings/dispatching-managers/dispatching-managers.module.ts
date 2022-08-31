import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchingManagersRoutingModule } from './dispatching-managers-routing.module';
import { DispatchingManagersComponent } from './dispatching-managers.component';
import { ManageDispatchingManagersComponent } from './manage-dispatching-managers/manage-dispatching-managers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatMenuModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatDialogModule, MatTableModule, MatAutocompleteModule, MatPaginatorModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { MatDividerModule } from '@angular/material/divider';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

@NgModule({
  declarations: [DispatchingManagersComponent, ManageDispatchingManagersComponent],
  imports: [
    CommonModule,
    DispatchingManagersRoutingModule,
    ReactiveFormsModule,

    // material
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatTableModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDividerModule,

    // shared
    ConfirmDeletionModule,
    LazyloadTranslateModule,

    // plugins
    NgxPermissionsModule.forChild(),
  ],
  entryComponents: [
    ManageDispatchingManagersComponent
  ]
})
export class DispatchingManagersModule { }
