import { Component, OnInit, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { FacadeService } from "@dms/app/services/facade.service";
import { SnackBar } from "@dms/app/utilities";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  @Input() userId: number;
  locale: string;

  constructor(public dialog: MatDialog, private facadeService: FacadeService) {
    this.facadeService.languageService.language.subscribe(lng => {
      this.locale = lng;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: "500px",
      minHeight: "150px",
      data: {
        userId: this.userId,
      },
      panelClass: "custom-dialog",
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } else {
      }
    });
  }

  ngOnInit() { }
}

@Component({
  selector: "app-change-password-dialog",
  templateUrl: "./change-password-dialog.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordDialogComponent {
  form: FormGroup;
  type: string = "password";

  constructor(
    fb: FormBuilder,
    private facadeService: FacadeService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: SnackBar,
    private readonly translateService: TranslateService
  ) {
    this.form = fb.group({
      password: ["", Validators.compose([Validators.required, Validators.minLength(6),])],
      confirmPassword: ["", Validators.compose([Validators.required, (value) => this.validateConfirmPassword(value)])],
    });
  }

  /**
   * cancel dialog
   *
   *
   */
  cancel(): void {
    this.dialogRef.close();
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

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    let body = {
      userId: this.data.userId,
      newPassword: this.form.get("password").value,
      confirmPassword: this.form.get("confirmPassword").value,
    };

    this.facadeService.userService.changePassword(body).subscribe((result: any) => {
      if (result) {
        this.snackBar.openSnackBar({
          message: this.translateService.instant('Password Change Successfully.'),
          action: this.translateService.instant('Okay'),
          duration: 2500
        })
      }
      this.dialogRef.close();
    });
  }

  /**
   * confirm two passwords
   *
   *
   * @param control
   */
  private validateConfirmPassword(
    control: AbstractControl
  ): ValidationErrors | null {
    return !this.form || control.value === this.form.controls.password.value
      ? null
      : { confirm: true };
  }

  /**
   * Display error msg
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case "password":
        if (this.form.get("password").hasError("required")) {
          return this.translateService.instant("Password required");
        } else if (this.form.get("password").hasError("minlength")) {
          return this.translateService.instant("Password must be at least 6 Characters");
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
}
