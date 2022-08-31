import { Component, OnInit } from '@angular/core';
import { FacadeService } from '@dms/app/services/facade.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SnackBar } from '@dms/app/utilities';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  // delete section
  selecteddeactivationReason: string;
  dialogContent: object;

  seasons: string[] = [
    this.translateService.instant('I’m lost and need help with my account'),
    this.translateService.instant('I need more time to test'),
    this.translateService.instant('I need to pause my billing'),
    this.translateService.instant('I want to start fresh later'),
    this.translateService.instant('I just want to delete my account'),
    this.translateService.instant('It costs too much'),
    this.translateService.instant('I found another app that I like better')
  ];

  form: FormGroup;
  constructor(
    private facadeService: FacadeService,
    fb: FormBuilder,
    private snackbar: SnackBar,
    private router: Router,
    private translateService: TranslateService
  ) {

    this.form = fb.group({
      password: ['', Validators.compose([Validators.required,
      Validators.minLength(8)])],
      deactivationReason: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.dialogContent = {
      title: this.translateService.instant("Are you sure to delete Your Account?"),
      openBtn: this.translateService.instant("Delete"),
      cancelBtn: this.translateService.instant("Cancel"),
      okayBtn: this.translateService.instant("Confirm"),
    }
  }

  /**
   * Display Error Message
   * 
   * 
   * @param input 
   */
  getError(input: string) {
    if (input === 'deactivationReason') {
      if (this.form.get('deactivationReason').hasError('required')) {
        return this.translateService.instant('deactivationReason required');
      } else {
        if (this.form.get('password').hasError('required')) {
          return this.translateService.instant('Password required');
        }
      }
    }
  }

  /**
   * Event Handler for Confirm Dialoug
   * 
   * 
   * @param event 
   */
  onConfirm(event) {
    if (!this.form.valid) {
      return;
    }

    let body = this.form.value;
    if (event) {
      this.facadeService.adminService.deleteAccount(body).subscribe(res => {
        if (res.succeeded) {
          this.snackbar.openSnackBar({
            message: this.translateService.instant('Success Account has been deleted'),
            action: this.translateService.instant('okay'),
            duration: 2500
          });
          this.facadeService.accountService.logout();
          this.router.navigateByUrl(Routes.Login);
        }
      });
    }
  }

}
