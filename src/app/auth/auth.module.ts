import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// components
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

// shared
import { CountryCodesModule } from '@dms/shared/country-codes/country-codes.module';
import { LazyloadTranslateModule } from '../shared/lazyload-translate/lazyload-translate.module';
import { SetDirModule } from '../directives/set-dir/set-dir.module';
import { ConfirmLogoutModule } from './confirm-logout/confirm-logout.module';
import { SignuutypesComponent } from './signuutypes/signuutypes.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    SignuutypesComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    // material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,

    // shared
    CountryCodesModule,
    LazyloadTranslateModule,
    SetDirModule,
    ConfirmLogoutModule
  ],
})
export class AuthModule { }
