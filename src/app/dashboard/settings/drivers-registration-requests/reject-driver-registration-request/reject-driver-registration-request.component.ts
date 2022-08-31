import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DriverRegistrationRequestsService } from '@dms/app/services/settings/driver-registration-requests.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from '@dms/app/utilities';

@Component({
  selector: 'app-reject-driver-registration-request',
  templateUrl: './reject-driver-registration-request.component.html',
  styleUrls: ['./reject-driver-registration-request.component.scss']
})
export class RejectDriverRegistrationRequestComponent implements OnInit {

  form: FormGroup;

  constructor(fb: FormBuilder,
    private driverRegistrationRequestsService: DriverRegistrationRequestsService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: SnackBar,
  ) {
    this.form = fb.group({
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  save() {
    const body = {
      driverId: Number(this.data.driverRequestId),
      reason: this.form.get('reason').value
    }

    this.driverRegistrationRequestsService.reject(body).subscribe(res => {
      this.snackBar.openSnackBar({
        action: this.translateService.instant('Okay'),
        duration: 2500,
        message: this.translateService.instant('Request has been rejected successfully')
      })
      this.dialog.closeAll();
    });
  }

  /**
   * show error for input 
   * 
   * 
   * @param form 
   * @param input 
   * @param msg 
   */
  getError(form: FormGroup, input: string, msg: string): String {
    if (form.get(input) && form.get(input).hasError('required')) {
      return this.translateService.instant(msg);
    }
  }

}
