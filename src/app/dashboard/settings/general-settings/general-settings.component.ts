import { Component, OnInit } from '@angular/core';
import { FacadeService } from '@dms/app/services/facade.service';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

interface KeyValue {
  id?: number;
  groupId?: number;
  settingKey: string;
  value?: string;
}

const GROUP_ID = 2;
@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  settings: KeyValue[] = [];
  loaded: boolean = false;

  settingsForm = {
    TenantFirstBrowsingPage: '',
    ManagerFirstBrowsingPage: '',
    DriverLoginRequestExpiration: '',
    ReachedDistanceRestriction: '',
  }

  firstBrowsingPage: { id: number, name: string }[] = [
    {
      id: 1,
      name: this.translateService.instant('Statistics Dashboard'),
    },
    {
      id: 2,
      name: this.translateService.instant('Map Dashboard'),
    },
    {
      id: 3,
      name: this.translateService.instant('Tasks Listing'),
    },
  ];

  /**
   * 
   * @param fb 
   * @param facadeService 
   * @param snackBar 
   * @param translateService 
   */
  constructor(
    private readonly facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService) {
  }

  ngOnInit() {
    this.getPreviousSettings();
  }

  getPreviousSettings() {
    this.facadeService.generalSettingsService.settingsByGroupId(GROUP_ID).subscribe((res: any) => {

      this.settings = res;
      this.settings.forEach((keyValue: KeyValue) => {

        if (keyValue.settingKey== 'DriverLoginRequestExpiration') {
          this.settingsForm.DriverLoginRequestExpiration = keyValue.value;
        }

        if (keyValue.settingKey == 'ReachedDistanceRestriction') {
          this.settingsForm.ReachedDistanceRestriction = keyValue.value;
        }

        if (keyValue.settingKey== 'TenantFirstBrowsingPage') {
          this.settingsForm.TenantFirstBrowsingPage = keyValue.value;
        }

        if (keyValue.settingKey== 'ManagerFirstBrowsingPage') {
          this.settingsForm.ManagerFirstBrowsingPage = keyValue.value;
        }

        this.loaded = true;
      });
    });
  }

  /**
   * update settings
   * 
   * 
   */
  updateSettings() {
    if (this.settingsForm.DriverLoginRequestExpiration == '' || this.settingsForm.ManagerFirstBrowsingPage == ''
     || this.settingsForm.TenantFirstBrowsingPage == '' || this.settingsForm.ReachedDistanceRestriction == '') {
      this.loaded = true;

      this.snackBar.openSnackBar({
        message: this.translateService.instant('Please fill required fields'),
        duration: 2500,
        action: this.translateService.instant('Okay')
      });

      return;
    }

    this.settings=[];
    for (const key in this.settingsForm) {
      if (Object.prototype.hasOwnProperty.call(this.settingsForm, key)) {
        const element = this.settingsForm[key];
        this.settings.push({
          settingKey: key,
          groupId: GROUP_ID,
          value: element,
        })
      }
    }

    this.facadeService.generalSettingsService.updateSettings(this.settings).subscribe(res => {
      this.snackBar.openSnackBar({
        message: this.translateService.instant('General settings updated successfully!'),
        action: this.translateService.instant('okay'),
        duration: 2500
      });

      this.getPreviousSettings();
    });
  }

  compareOptions(value1: string, value2: string): boolean {
    return value1 == value2;
  }
}
