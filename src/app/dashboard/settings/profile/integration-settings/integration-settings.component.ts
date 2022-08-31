import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SettingsViewModel } from '../../../../models/settings/SettingsViewModel';
import { FacadeService } from '../../../../services/facade.service';
import { SnackBar, Body } from '@dms/utilities/snakbar';

@Component({
  selector: 'app-integration-settings',
  templateUrl: './integration-settings.component.html',
  styleUrls: ['./integration-settings.component.scss']
})
export class IntegrationSettingsComponent implements OnInit {



  form: FormGroup;
  settingSendOrderToArmada: SettingsViewModel = new SettingsViewModel(0, 'IsEnableSendOrderToArmada', 'false', '', 1);
  settingSendOrderToDelicon: SettingsViewModel = new SettingsViewModel(0, 'IsEnableSendOrderToDelicon', 'false', '', 1);
  settingSendOrderToMashkor: SettingsViewModel = new SettingsViewModel(0, 'IsEnableSendOrderToMashkor', 'false', '', 1);

  newSettings: SettingsViewModel = new SettingsViewModel(0, '', '', '', 1);
  languageCode: string;


  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService  )
  {
    this.form = fb.group({
      apiKey: [''],
    });
  }

  apiKey:any;

  ngOnInit() {
    this.facadeService.languageService.language.subscribe(lng => {
      this.languageCode = lng;
    });
    this.generatAPIKey();
    this.getSettings();

  }



  copyAPIKeyToClipord() {
    var apiKey = this.form.get("apiKey").value;
  }


  generatAPIKey() {
    this.form.get("apiKey").setValue("");
    this.facadeService.userService.GenerateAPIKey().subscribe(res => {
      this.apiKey = res
      this.form.get("apiKey").setValue(res);
    })

  }


  onChange(event: MatSlideToggleChange) {
    const value = event.checked;

    if (value) {
      this.settingSendOrderToArmada.value = "true";
    } else {
      this.settingSendOrderToArmada.value = "false";
    }

    this.facadeService.autoAllocationService.update(this.settingSendOrderToArmada).subscribe((result: any) => {
      let status = '';
      value == true ? status = this.translateService.instant('Enabled') : status = this.translateService.instant('Disabled');
      if (value) {
        this.getSettings();
      }


      let message = '';
      switch (this.languageCode) {
        case 'ar':
          message = `${status} ${this.translateService.instant('Enable Sending Order To Armada ')}`
          break;

        default:8
          message = `${this.translateService.instant('Enable Sending Order To Armada ')} ${status}`
          break;
      }

      const body: Body = {
        message: message,
        action: this.translateService.instant("Okay"),
        duration: 2000
      }

      this.snackBar.openSnackBar(body);
    });
  }


  onChangeDeliconDelivery(event: MatSlideToggleChange) {
    const value = event.checked;

    if (value) {
      this.settingSendOrderToDelicon.value = "true";
    } else {
      this.settingSendOrderToDelicon.value = "false";
    }

    this.facadeService.autoAllocationService.update(this.settingSendOrderToDelicon).subscribe((result: any) => {
      let status = '';
      value == true ? status = this.translateService.instant('Enabled') : status = this.translateService.instant('Disabled');
      if (value) {
        this.getSettings();
      }


      let message = '';
      switch (this.languageCode) {
        case 'ar':
          message = `${status} ${this.translateService.instant('Enable Sending Order To Delicon ')}`
          break;

        default: 8
          message = `${this.translateService.instant('Enable Sending Order To Delicon ')} ${status}`
          break;
      }

      const body: Body = {
        message: message,
        action: this.translateService.instant("Okay"),
        duration: 2000
      }

      this.snackBar.openSnackBar(body);
    });
  }

  onChangeMashkorDelivery(event: MatSlideToggleChange) {
    const value = event.checked;

    if (value) {
      this.settingSendOrderToMashkor.value = "true";
    } else {
      this.settingSendOrderToMashkor.value = "false";
    }

    this.facadeService.autoAllocationService.update(this.settingSendOrderToMashkor).subscribe((result: any) => {
      let status = '';
      value == true ? status = this.translateService.instant('Enabled') : status = this.translateService.instant('Disabled');
      if (value) {
        this.getSettings();
      }


      let message = '';
      switch (this.languageCode) {
        case 'ar':
          message = `${status} ${this.translateService.instant('Enable Sending Order To Mashkor ')}`
          break;

        default: 8
          message = `${this.translateService.instant('Enable Sending Order To Mashkor ')} ${status}`
          break;
      }

      const body: Body = {
        message: message,
        action: this.translateService.instant("Okay"),
        duration: 2000
      }

      this.snackBar.openSnackBar(body);
    });
  }



  getSettings() {

    //isEnable
    this.facadeService.autoAllocationService.settingsByGroupId(1).subscribe((result: SettingsViewModel[]) => {

      result.forEach(settings => {
        if (settings.settingKey == 'IsEnableSendOrderToArmada') {
          this.settingSendOrderToArmada = settings;

          if (this.settingSendOrderToArmada == undefined || this.settingSendOrderToArmada == null) {
            this.settingSendOrderToArmada = this.sendNewSetting("IsEnableSendOrderToArmada", "false", "boolean");
          } else if (this.settingSendOrderToArmada.value == "false") {
          }
        }
        if (settings.settingKey == 'IsEnableSendOrderToDelicon') {
          this.settingSendOrderToDelicon = settings;

          if (this.settingSendOrderToDelicon == undefined || this.settingSendOrderToDelicon == null) {
            this.settingSendOrderToDelicon = this.sendNewSetting("IsEnableSendOrderToDelicon", "false", "boolean");
          } else if (this.settingSendOrderToDelicon.value == "false") {
          }
        }
        if (settings.settingKey == 'IsEnableSendOrderToMashkor') {
          this.settingSendOrderToMashkor = settings;

          if (this.settingSendOrderToMashkor == undefined || this.settingSendOrderToMashkor == null) {
            this.settingSendOrderToMashkor = this.sendNewSetting("IsEnableSendOrderToMashkor", "false", "boolean");
          } else if (this.settingSendOrderToMashkor.value == "false") {
          }
        }
      });
    });
  }

  sendNewSetting(key: string, value: string, dataType: string): SettingsViewModel {

    this.newSettings.settingKey = key;
    this.newSettings.value = value;
    this.newSettings.settingDataType = dataType;
    this.newSettings.groupId = 1;

    this.facadeService.autoAllocationService.update(this.newSettings).subscribe((result: any) => {
      this.newSettings = result;
    });

    return this.newSettings;
  }


}
