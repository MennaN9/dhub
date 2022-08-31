import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ThemePalette } from '@angular/material/core';
import { Routes } from '@dms/app/constants/routes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showForm: boolean = false;
  success: boolean = false;
  progress: boolean = false;

  form: FormGroup;
  errors: string[] = [];
  color: ThemePalette = 'accent';

  readonly login = Routes.Login;
  invalidToken: boolean = false;
  type: string = "password";
  submitted: boolean = false;

  /**
   *
   * @param fb
   * @param facadeService
   * @param activatedRoute
   */
  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&_*]/)]],
      confirmPassword: ['', [Validators.required, (value) => this.validateConfirmPassword(value)]],
      token: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      let email: string = params['email'];
      let token: string = params['token'];
      this.checkResetToken(email, token);
    });
  }

  /**
   * check rest token
   *
   *
   * @param email
   * @param token
   */
  checkResetToken(email: string, token: string) {
    this.progress = true;
    this.facadeService.accountService.checkResetToken({ email, token }).subscribe(res => {
      this.progress = false;
      if (res.succeeded === true) {
        this.form.get('email').setValue(email);
        this.form.get('token').setValue(token);
        this.showForm = true;
      } else {
        this.invalidToken = true;
        this.errors = res.errors.map(e => e.description);
      }
    },
      err => {
        this.progress = false;
      });
  }

  /**
   * Display error msg
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case "newPassword":
        if (this.form.get("newPassword").hasError("required")) {
          return this.translateService.instant("Password required");
        } else if (this.form.get("newPassword").hasError("minlength")) {
          return this.translateService.instant("Password must be at least 6 Characters");
        } else if (this.form.get("newPassword").hasError("pattern")) {
          return this.translateService.instant(`This value is too short. It should have 6 characters or more. Password must be at least 8 characters long and must contain one lower case, one uppercase, one numeric and one special character.`);
        }
        break;

      case "confirmPassword":
        if (this.form.get("confirmPassword").hasError("required")) {
          return this.translateService.instant("Password required");
        } else if (this.form.get("confirmPassword").hasError("confirm")) {
          return this.translateService.instant('Confirm password required');
        }
        break;
    }
  }

  /**
   * sign in
   *
   *
   * @param value
   */
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.facadeService.accountService.resetPassword(this.form.value).subscribe(res => {
      this.showForm = false;
      this.success = true;
    });
  }

  /**
   * confirm two passwords
   *
   *
   * @param control
   */
  private validateConfirmPassword(control: AbstractControl): ValidationErrors | null {
    return !this.form || control.value === this.form.controls.newPassword.value ? null : { confirm: true };
  }


  /**
   * password to text and inverse
   *
   *
   */
  togglePassword() {
    if (this.type == "password") {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }

}
