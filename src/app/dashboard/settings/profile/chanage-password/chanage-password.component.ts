import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FacadeService } from '@dms/app/services/facade.service';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chanage-password',
  templateUrl: './chanage-password.component.html',
  styleUrls: ['./chanage-password.component.scss']
})

export class ChanagePasswordComponent implements OnInit {
  form: FormGroup;
  hide = {password: true, confirmPassword: true,newPassword:true};

  isError: boolean= false;
  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {
    this.form = fb.group(
      {
        currentPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&_*]/)])],
        newPassword: ['', Validators.compose([Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&_*]/),
        (value) => this.validateNotEqualPassword(value)
        ])],
        confirmPassword: ['', [Validators.required, (value) => this.validateConfirmPassword(value)]]
      })
  }

  ngOnInit() {
    this.UpdateValidation();
  }

  // Subscibe to value changes in new Password to validate against Confirm Password
  UpdateValidation() {
    this.form.get('newPassword').valueChanges.subscribe(() =>
      this.form.get('confirmPassword').updateValueAndValidity()
    )
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
   *
   * @param control confirm Current password Does not equal New Password
   */
  private validateNotEqualPassword(control: AbstractControl): ValidationErrors | null {
    return !this.form || control.value !== this.form.controls.currentPassword.value ? null : { notEqual: true };
  }

  /**
    * Display error msg
    *
    *
    * @param input
    */
  getError(input: string) {
    switch (input) {

      case 'password':
        if (this.form.get('currentPassword').hasError('required')) {
          return this.translateService.instant('Password required');
        } else if (this.form.get('currentPassword').hasError('minlength')) {
          return this.translateService.instant('Password must be at least 6 Characters');
        } else if (this.form.get('currentPassword').hasError('pattern')) {
          return this.translateService.instant(` This value is too short. It should have 8 characters or more. Password must be at least 8 characters long and must contain one lower case, one uppercase, one numeric and one special character.`);
        }
        break;

      case 'newPassword':
        if (this.form.get('newPassword').hasError('required')) {
          return this.translateService.instant('Password required');
        } else if (this.form.get('newPassword').hasError('minlength')) {
          return this.translateService.instant('Password must be at least 6 Characters');
        } else if (this.form.get('newPassword').hasError('pattern')) {
          return this.translateService.instant(` This value is too short. It should have 8 characters or more. Password must be at least 8 characters long and must contain one lower case, one uppercase, one numeric and one special character.`);
        } else if (this.form.get('newPassword').hasError('notEqual')) {
          return this.translateService.instant(`New Password cannot equal to current password`);
        }
        break;

      case 'confirmPassword':
        if (this.form.get('confirmPassword').hasError('confirm')) {
          return this.translateService.instant('Password and password confirmation don\'t match');
        }
        break;

      default:
        return '';
    }
  }

  // Event handler for Form Sumbuit
  onSubmit() {

    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.isError = true;
      return;
    }
    this.isError = false;
    let body = this.form.value;

    this.facadeService.adminService.changePassword(body).subscribe(res => {
      if (res.succeeded === true) {
        this.snackBar.openSnackBar({ message: this.translateService.instant('Successfully changed'), action: this.translateService.instant('okay'), duration: 2500 });
      }
    });
  }
  // Event handler to prevent pasting data on Password box
  onPaste(event: ClipboardEvent) {
    return false;
  }
}
