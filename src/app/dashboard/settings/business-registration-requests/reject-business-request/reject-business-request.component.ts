import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusinessRegistrationRequestsService } from '@dms/app/services/tanent/business-registration-requests.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from '@dms/app/utilities';

@Component({
  selector: 'app-reject-business-request',
  templateUrl: './reject-business-request.component.html',
  styleUrls: ['./reject-business-request.component.scss']
})
export class RejectBusinessRequestComponent implements OnInit {

  form: FormGroup;

  constructor(fb: FormBuilder,
    private businessRegistrationRequestsService: BusinessRegistrationRequestsService,
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
      tenantId: Number(this.data.id),
      reason: this.form.get('reason').value
    }

    this.businessRegistrationRequestsService.reject(body).subscribe(res => {
      this.snackBar.openSnackBar({
        action: this.translateService.instant('Okay'),
        duration: 2500,
        message: this.translateService.instant('Request has been rejected successfully')
      })
      this.dialog.closeAll();
    });
  }
}
