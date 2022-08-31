import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Routes } from '@dms/app/constants/routes';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmLogoutComponent } from '../confirm-logout/confirm-logout.component';
import { MatDialog } from '@angular/material/dialog';
import { BusinessRegistrationService, Type } from '@dms/app/services/tanent/business-registration.service';

const STATISTICS_DASHBOARD = 1;
const MAP_DASHBOARD = 2;
const TASKS_LISTING = 3;
const PROFILE = 4;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly forgotPassword = Routes.forgotPassword;
  readonly register = Routes.register;

  form: FormGroup;
  errors: string[] = [];
  color: ThemePalette = 'accent';
  type: string = 'password';
  businessTypes: Type[] = [];

  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private businessRegistrationService: BusinessRegistrationService) {
    this.form = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.facadeService.accountService.isLoggedIn) {
      this.navigate(this.facadeService.accountService.user.dashboardPage);
    }
    this.businessRegistrationService.getBusinessTypes().subscribe((res: any) => {
      this.businessTypes = res;
    });
  }

  navigate(type: number): void {
    if (type == STATISTICS_DASHBOARD) {
      this.router.navigate([Routes.superAdminDashboard]);
    } else if (type == MAP_DASHBOARD) {
      this.router.navigate([Routes.dashboard]);
    } else if (type == TASKS_LISTING) {
      this.router.navigate([Routes.tasks]);
    } else if (type == PROFILE) {
      this.router.navigate([Routes.profile]);
    } else {
      this.router.navigate([Routes.profile]);
    }
  }

  /**
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'email':
        if (this.form.get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        break;

      case 'password':
        if (this.form.get('password').hasError('required')) {
          return this.translateService.instant(`Password required`);
        }
        break;

      default:
        return '';
    }
  }

  async onSubmit(form: FormGroup) {
    if (form.invalid) {
      return this.form.markAllAsTouched();
    }

    const body: { email: string, password: string } = form.value;
    const session = await this.facadeService.accountService.validateSession(body.email).toPromise();

    if (session && session['isVaildToLogin']) {
      this.facadeService.accountService.login(body).subscribe(res => {
        this.navigate(this.facadeService.accountService.user.dashboardPage);
      });
    } else {
      const dialog = this.dialog.open(ConfirmLogoutComponent, {
        width: '35%',
        height: '25%',
        data: {
          userId: session['userId']
        },
      });

      dialog.disableClose = true;

      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.facadeService.accountService.login(body).subscribe(res => {
            this.navigate(this.facadeService.accountService.user.dashboardPage);
          });
        }
      });
    }
  }

  togglePassword() {
    if (this.type == 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
