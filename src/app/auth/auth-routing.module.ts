import { SignuutypesComponent } from './signuutypes/signuutypes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token/:email',
    component: ResetPasswordComponent
  },
  {
    path: 'terms-of-service',
    component: TermsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'sing-up-register-types',
    component: SignuutypesComponent
  },
  {
    path: 'individual-registration',
    loadChildren: () => import('@dms/app/auth/individual-registration/individual.module').then(m => m.IndividualModule),
  },
  {
    path: 'home-business-registration',
    loadChildren: () => import('@dms/app/auth/business-registration/business-registration.module').then(m => m.BusinessRegistrationModule),
  },
  {
    path: 'corporate-business-registration',
    loadChildren: () => import('@dms/app/auth/corporate-registration/corporate.module').then(m => m.CorporateModule),
  },
  {
    path: 'delivery-business-registration',
    loadChildren: () => import('@dms/app/auth/delivery-registration/delivery.module').then(m => m.DeliveryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
