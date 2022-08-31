import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// components
import { ProfileComponent } from './profile.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ChanagePasswordComponent } from './chanage-password/chanage-password.component';
import { BasicUserInfoComponent } from './basic-user-info/basic-user-info.component';

import {
  MatAutocompleteModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatButtonModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
} from '@angular/material';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDividerModule } from '@angular/material/divider';

import { ChangeLanguageComponent } from './change-language/change-language.component';
import { ExerciseYourRightsComponent } from './exercise-your-rights/exercise-your-rights.component';
import { CountryCodesModule } from '@dms/app/shared/country-codes/country-codes.module';
import { ConfirmDeletionModule } from '@dms/app/shared/confirm-deletion/confirm-deletion.module';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { DefaultPickupBranchComponent } from './default-pickup-branch/default-pickup-branch.component';
import { IntegrationSettingsComponent } from './integration-settings/integration-settings.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DeleteAccountComponent,
    ChanagePasswordComponent,
    BasicUserInfoComponent,
    ChangeLanguageComponent,
    ExerciseYourRightsComponent,
    DefaultPickupBranchComponent,
    IntegrationSettingsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,

    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    // shared
    CountryCodesModule,
    ConfirmDeletionModule,
    LazyloadTranslateModule,
  ]
})
export class ProfileModule { }

