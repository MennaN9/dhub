import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Routes } from '@dms/app/constants/routes';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  readonly login = Routes.Login;

  form: FormGroup;
  errors: string[] = [];
  progress: boolean = false;
  color: ThemePalette = 'accent';


  /**
   *
   * @param fb
   * @param facadeService
   * @param router
   */
  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private router: Router,
    private snackBar: SnackBar,
    private translateService:TranslateService) {

    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (this.facadeService.accountService.isLoggedIn) {
      this.router.navigate(['app']);
    }
  }

  /**
   * validate form inputs
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'email':
        if (this.form.get('email').hasError('required')) {
           return this.translateService.instant(`Email required`);
        }

        if (this.form.get('email').hasError('email')) {

          return  this.translateService.instant(`Email not valid`);
        }
        break;

      default:
        return '';
    }
  }

  /**
   * sign in
   *
   *
   * @param value
   */
  onSubmit() {
    if (!this.form.valid) {
      return
    };

    this.facadeService.accountService.forgotPassword(this.form.value).subscribe(res => {

      if (res.succeeded === true) {
        this.form.reset();
        this.snackBar.openSnackBar({ message: 'Please check your email', action: 'okay', duration: 2500 });
        setTimeout(() => {
          this.router.navigate([Routes.Login]);
        }, 2500);
      } else {
        this.errors = res.errors.map(e => e.description);
      }
    });
  }

}
