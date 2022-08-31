import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { DriverLoginRequest } from "@dms/app/models/settings/driver-login-request";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-cancel-reason-type",
  templateUrl: "./cancel-reason-type.component.html",
  styleUrls: ["./cancel-reason-type.component.scss"],
})
export class CancelReasonTypeComponent implements OnInit {
  form: FormGroup;
  rejectReason: string;

  constructor(
    public dialogRef: MatDialogRef<CancelReasonTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.form = fb.group({
      rejectReason: ['', Validators.required],
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    let request: DriverLoginRequest = this.data["element"];
    // if (this.rejectReason) {
    // }

    request.rejectReason = this.form.value.rejectReason;
    this.dialogRef.close(request);
  }

  /**
   * close
   * 
   * 
   */
  cancel() {
    this.dialogRef.close();
  }

  /**
  * check if form input has an error
  *
  *
  * @param input
  */
  getError() {
    if (this.form.get('rejectReason').hasError('required')) {
      return this.translateService.instant('Reason required');
    }
  }
}
