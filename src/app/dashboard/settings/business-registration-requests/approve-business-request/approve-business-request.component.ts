import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeneralSettingsService } from '@dms/app/services/settings/general-settings.service';
import { BusinessRegistrationService } from '@dms/app/services/tanent/business-registration.service';
import { BusinessRegistrationRequestsService } from '@dms/app/services/tanent/business-registration-requests.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { MatRadioChange } from '@angular/material/radio';
import { Subscription } from 'rxjs';

interface Option {
  id: string;
  name: string;
}

@Component({
  selector: 'app-approve-business-request',
  templateUrl: './approve-business-request.component.html',
  styleUrls: ['./approve-business-request.component.scss']
})
export class ApproveBusinessRequestComponent implements OnInit, OnDestroy {

  methods: Option[] = [];
  modules: Option[] = [];

  form: FormGroup;
  isFullVersion: string = 'true';
  subscriptions = new Subscription();

  constructor(private fb: FormBuilder,
    private businessRegistrationRequestsService: BusinessRegistrationRequestsService,
    private generalSettingsService: GeneralSettingsService,
    private businessRegistrationService: BusinessRegistrationService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: SnackBar) {
    this.form = this.fb.group({
      isFullVersion: ['true'],
      autoAllocationMethod: [null],
      selectedModules: [null]
    });
  }

  ngOnInit() {
    this.subscriptions.add(this.generalSettingsService.getAutoAllocationMethods().subscribe((res: Option[]) => {
      this.methods = res;

      if (this.methods.length > 0) {
        this.form.get('autoAllocationMethod').setValue(this.methods[0].id);
      }
    }));

    this.subscriptions.add(this.businessRegistrationService.defaultModules.subscribe((res: Option[]) => {
      this.modules = res;
    }));
  }

  approve() {
    let body = this.form.value;
    body['tenantRegistrationId'] = this.data.id;

    this.subscriptions.add(this.businessRegistrationRequestsService.approve(this.form.value).subscribe(res => {

      this.snackBar.openSnackBar({
        action: this.translateService.instant('Okay'),
        duration: 2500,
        message: this.translateService.instant('Request has been approved successfully')
      })

      this.dialog.closeAll();
    }));
  }

  onChangeVersion(event: MatRadioChange) {
    this.isFullVersion = event.value;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
