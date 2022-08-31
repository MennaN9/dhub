import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange, MatButtonToggleChange } from '@angular/material';
import { SnackBar, Body } from '@dms/utilities/snakbar';
import { FacadeService } from '@dms/app/services/facade.service';
import { AutoAllocation } from '@dms/app/models/settings/AutoAllocation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auto-allocation',
  templateUrl: './auto-allocation.component.html',
  styleUrls: ['./auto-allocation.component.scss'],
})

export class AutoAllocationComponent implements OnInit {

  group: any;
  isDisabledOne: boolean = true;
  isDisabledTwo: boolean = true;
  selectedMehtod: string = '';

  descMessage: string = '';
  settingEnableAutoAllocation: AutoAllocation = new AutoAllocation(0, 'IsEnableAutoAllocation', 'false', '', 1);
  settingSelectedMethod: AutoAllocation = new AutoAllocation(0, '', '', 'string', 1);
  settingAvailableRadius: AutoAllocation = new AutoAllocation(0, 'NearestAvailableMethodRadiusInKM', '', 'string', 1);
  settingExpires: AutoAllocation = new AutoAllocation(0, '', '30', '', 1);
  settingNumberOfRetries: AutoAllocation = new AutoAllocation(0, 'OneByOneAllocationNumberOfRetries', '', 'string', 1);

  settingNearestAvailableMethodNumberOfRetries: AutoAllocation = new AutoAllocation(0, 'NearestAvailableMethodNumberOfRetries', '', 'string', 1);
  settingClubbingTimeInSec: AutoAllocation = new AutoAllocation(0, 'FIFOAllocationClubbingTimeInSec', '', 'string', 1);
  settingFifoDriverOrderCapacity: AutoAllocation = new AutoAllocation(0, 'FirstInFirstOutMethodDriverOrderCapacity', '', 'string', 1);
  settingNearestAvailableMethodOrderCapacity: AutoAllocation = new AutoAllocation(0, 'NearestAvailableMethodOrderCapacity', '', 'string', 1);

  newSettings: AutoAllocation = new AutoAllocation(0, '', '', '', 1);
  languageCode: string;

  constructor(private snackBar: SnackBar, private facadeService: FacadeService, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.facadeService.languageService.language.subscribe(lng => {
      this.languageCode = lng;
    });

    this.setDescMessage('NearestAvailableMethod');
    this.getSettings();
  }

  /**
   * fetch all settings
   *
   */
  getSettings() {

    //isEnable
    this.facadeService.autoAllocationService.settingsByGroupId(1).subscribe((result: AutoAllocation[]) => {

      result.forEach(settings => {
        if (settings.settingKey == 'IsEnableAutoAllocation') {
          this.settingEnableAutoAllocation = settings;

          if (this.settingEnableAutoAllocation == undefined || this.settingEnableAutoAllocation == null) {
            this.settingEnableAutoAllocation = this.sendNewSetting("IsEnableAutoAllocation", "false", "boolean");
          } else if (this.settingEnableAutoAllocation.value == "false") {
            this.selectedMehtod = '';
          }
        }

        if (settings.settingKey == 'SelectedAutoAllocationMethodName') {
          this.settingSelectedMethod = settings;

          if (this.settingSelectedMethod == undefined || this.settingSelectedMethod == null) {
            this.settingSelectedMethod = this.sendNewSetting("SelectedAutoAllocationMethodName", "NearestAvailableMethod", "string");
            this.selectedMehtod = '';
          } else {
            this.selectedMehtod = this.settingSelectedMethod.value;
          }
        }

        this.fillData(settings);
      });
    });
  }

  /**
   * fetch all settings data for method
   *
   */
  fillData(settings: AutoAllocation) {

    //Method Values - NearestAvailableMethodRadiusInKM
    if (settings.settingKey === 'NearestAvailableMethodRadiusInKM') {
      this.settingAvailableRadius = settings;

      if (this.settingAvailableRadius == undefined || this.settingAvailableRadius == null) {
        this.settingAvailableRadius = this.sendNewSetting("NearestAvailableMethodRadiusInKM", "1", "string");
      }
    }

    //Method Values - OneByOneAllocationRequestExpiresInSEC
    if (settings.settingKey === 'OneByOneAllocationRequestExpiresInSEC') {
      this.settingExpires = settings;

      if (this.settingExpires == undefined || this.settingExpires == null) {
        this.settingExpires = this.sendNewSetting("OneByOneAllocationRequestExpiresInSEC", "30", "string");
      }
    }

    //Method Values - OneByOneAllocationNumberOfRetries
    if (settings.settingKey === 'OneByOneAllocationNumberOfRetries') {
      this.settingNumberOfRetries = settings;

      if (this.settingNumberOfRetries == undefined || this.settingNumberOfRetries == null) {
        this.settingNumberOfRetries = this.sendNewSetting("OneByOneAllocationNumberOfRetries", "", "string");
      }
    }

    //Method Values - NearestAvailableMethodNumberOfRetries
    if (settings.settingKey === 'NearestAvailableMethodNumberOfRetries') {
      this.settingNearestAvailableMethodNumberOfRetries = settings;

      if (this.settingNearestAvailableMethodNumberOfRetries == undefined || this.settingNearestAvailableMethodNumberOfRetries == null) {
        this.settingNearestAvailableMethodNumberOfRetries = this.sendNewSetting("NearestAvailableMethodNumberOfRetries", "", "string");
      }
    }

    //Method Values - FIFOAllocationClubbingTimeInSec
    if (settings.settingKey === 'FIFOAllocationClubbingTimeInSec') {
      this.settingClubbingTimeInSec = settings;

      if (this.settingClubbingTimeInSec == undefined || this.settingClubbingTimeInSec == null) {
        this.settingClubbingTimeInSec = this.sendNewSetting("FIFOAllocationClubbingTimeInSec", "", "string");
      }
    }


    //Method Values - FirstInFirstOutMethodDriverOrderCapacity
    if (settings.settingKey === 'FirstInFirstOutMethodDriverOrderCapacity') {
      this.settingFifoDriverOrderCapacity = settings;

      if (this.settingFifoDriverOrderCapacity == undefined || this.settingFifoDriverOrderCapacity == null) {
        this.settingFifoDriverOrderCapacity = this.sendNewSetting("FirstInFirstOutMethodDriverOrderCapacity", "", "string");
      }
    }

    //Method Values - NearestAvailableMethodOrderCapacity
    if (settings.settingKey === 'NearestAvailableMethodOrderCapacity') {
      this.settingNearestAvailableMethodOrderCapacity = settings;

      if (this.settingNearestAvailableMethodOrderCapacity == undefined || this.settingNearestAvailableMethodOrderCapacity == null) {
        this.settingNearestAvailableMethodOrderCapacity = this.sendNewSetting("NearestAvailableMethodOrderCapacity", "", "string");
      }
    }

  }

  /**
    * @todo Send new setting if not exsist
    *
    * @param key , value , dataType
    */
  sendNewSetting(key: string, value: string, dataType: string): AutoAllocation {

    this.newSettings.settingKey = key;
    this.newSettings.value = value;
    this.newSettings.settingDataType = dataType;
    this.newSettings.groupId = 1;

    this.facadeService.autoAllocationService.update(this.newSettings).subscribe((result: any) => {
      this.newSettings = result;
    });

    return this.newSettings;
  }

  /**
   * Disable / Enable methods
   *
   *
   * @param event MatSlideToggleChange
   */
  onChange(event: MatSlideToggleChange) {
    const value = event.checked;

    if (value) {
      this.settingEnableAutoAllocation.value = "true";
    } else {
      this.selectedMehtod = '';
      this.settingEnableAutoAllocation.value = "false";
    }

    this.facadeService.autoAllocationService.update(this.settingEnableAutoAllocation).subscribe((result: any) => {
      let status = '';
      value == true ? status = this.translateService.instant('Enabled') : status = this.translateService.instant('Disabled');
      if (value) {
        this.getSettings();
      }


      let message = '';
      switch (this.languageCode) {
        case 'ar':
          message = `${status} ${this.translateService.instant('Auto allocations has been')}`
          break;

        default:
          message = `${this.translateService.instant('Auto allocations has been')} ${status}`
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

  /**
   * @todo change method
   *
   *
   * @param event MatButtonToggleChange
   */
  onChangeMethod(event: MatButtonToggleChange) {
    const value = event && event.value;
    this.selectedMehtod = value;
    this.setDescMessage(value);
    this.settingSelectedMethod.value = this.selectedMehtod;
  }

  /**
   *
   * @param type
   */
  setDescMessage(type: string) {
    switch (type) {
      // case 'sendToAll':
      //   this.descMessage = `Sends the task request notification to the driver available in the task time-slot. The task gets assigned to the "Driver who accepts the task request first. If no driver accepts the task, it remains unassigned."`
      //   break;

      // case 'batchWise':
      //   this.descMessage = `Sends the task request notification to driver in batches. You can create batches based on distance, time and group size settings . The task gets assigned to the driver who accepts the task request first. If no driver accepts the task, it remains unassigned.`;
      //   break;

      // case 'roundRobin':
      //   this.descMessage = `Driver Agent within a defined radius are circularly force assigned.`;
      //   break;

      case 'FirstInFirstOutMethod':
        this.descMessage = this.translateService.instant(`Send the task request notification based on First-in, First-out (FIFO). All the created task are arranged in a queue and the request for the second task is not sent until first task gets assigned. The request is sent to the Driver in batches (same as batch wise allocation). You can create batches based on distance, time and group size settings.`);
        break;

      case 'NearestAvailableMethod':
        this.descMessage = this.translateService.instant(`Force assigns the task to driver based on availability and distance.`);
        break;

      // case 'OneByOneMethod':
      //   this.descMessage = `Sends the task request notification to the driver nearest to the task Location. If the driver doesn’t accept the task within the request expiry time, the task request is sent to the next nearest driver. If no driver accepts the task, it remains unassigned.`;
      //   break;

      default:
        break;
    }
  }

  /**
   * Save vairables data on submit form
   *
   *
   */
  SaveForm() {
    const message: Body = {
      message: this.translateService.instant(`Auto allocation has been updated successfully`),
      action: this.translateService.instant("Okay"),
      duration: 2000
    }

    const body = [
      this.settingAvailableRadius,
      this.settingExpires,
      this.settingNearestAvailableMethodNumberOfRetries,
      this.settingClubbingTimeInSec,
      this.settingFifoDriverOrderCapacity,
      this.settingNearestAvailableMethodOrderCapacity,
      this.settingSelectedMethod,
      this.settingSelectedMethod,
      this.settingNumberOfRetries
    ];

    this.facadeService.autoAllocationService.updateRange(body).subscribe(res => {
      this.snackBar.openSnackBar(message);
    });
  }
}
