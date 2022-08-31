import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';

// angular material
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';

// shared
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';

// plugins
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

@NgModule({
  declarations: [
    TeamsComponent,
    ManageTeamComponent
  ],
  imports: [
    CommonModule,

    // material
    MatSelectModule,
    TeamsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatChipsModule,
    MatCardModule,
    FlexLayoutModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatDividerModule,

    ReactiveFormsModule,
    FormsModule,

    // shared
    ConfirmDeletionModule,
    LazyloadTranslateModule,

    // plugins
    NgxPermissionsModule.forChild(),
    MatGoogleMapsAutocompleteModule
  ],
  entryComponents: [
    ManageTeamComponent
  ]
})
export class TeamsModule { }
