import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FacadeService } from '@dms/services/facade.service';
import { Team } from '@dms/models/settings/Team';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Images } from '@dms/constants/images';
import { MatRadioButton, MatCheckboxChange } from '@angular/material';
import { zip, Observable } from 'rxjs';
import { TaskSettingsViewModel, MainTaskViewModel } from '@dms/app/models/task/assignDriverMainTaskViewModel';
import { AutoAllocation } from '../../../models/settings/AutoAllocation';
import { App } from '@dms/app/core/app';

interface Driver {
  id: number;
  imageUrl?: any;
  teamId: number;
  tags: string;
  name: string;
  agentStatusId: number;
  agentStatusName: string;
  tagsArray: string[];
}

@Component({
  selector: 'app-automatic-or-manual-assign',
  templateUrl: './automatic-or-manual-assign.component.html',
  styleUrls: ['./automatic-or-manual-assign.component.scss']
})
export class AutomaticOrManualAssignComponent implements OnInit {

  public readonly placeholder = Images.user;
  public readonly imageUrl = App.driverImagesUrl;

  selectedDriver = 0;
  selectedTeam = 0;
  selectedGeoFence = 1;

  teams: Team[] = [];
  tags: string[] = [];
  drivers: Driver[] = [];

  tempDrivers: Driver[];
  tempTeams: Team[] = [];
  tempTags: string[];

  teamsKeywords: any;
  tagsKeywods: string;
  driversKeywods: string;


  @Output() onChangeDrivers: EventEmitter<Driver[]> = new EventEmitter<Driver[]>();

  filterTeams: string;
  selectedDrivers: number[] = [];
  selectedTeams: number[] = [];
  enableAutomaticAssign: boolean = false;
  driversCount: number;
  selectedTags: string[] = [];
  teamIds: number[] = [];
  enableTeams: boolean = true;
  enableTags: boolean = true;
  enableTeamsView: boolean = true;
  disableSelectGeofences: boolean = true;
  _restrictGeofences: boolean = false;

  mainTask: MainTaskViewModel;
  settings: TaskSettingsViewModel;

  isDefaultEnableAutoAllocation = false;
  settingEnableAutoAllocation: AutoAllocation = new AutoAllocation(0, '', '', '', 1);

  constructor(private facadeService: FacadeService,
    public dialogRef: MatDialogRef<AutomaticOrManualAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.mainTask) {
      this.mainTask = data.mainTask;
      this.mainTask.settings;

      if (this.mainTask.settings.auto === true) {
        this.isDefaultEnableAutoAllocation = true;
        this.enableAutomaticAssign = true;
        this.driversCount = 1;
      } else {
        this.isDefaultEnableAutoAllocation = false;
      }
    }

    if (data && data.selectedDriversIds) {
      this.selectedDrivers = data.selectedDriversIds;
    }
  }

  get restrictGeofences() {
    if (this.disableSelectGeofences) return false;
    else return this._restrictGeofences;
  }

  set restrictGeofences(value: boolean) {
    this._restrictGeofences = value;
  }

  loadSettings() {
    this.selectedDrivers = this.mainTask.settings.driverIds;
    if (this.mainTask.settings.restrictGeofences != null) this.restrictGeofences = !!this.mainTask.settings.restrictGeofences;
    if (this.mainTask.settings.auto === true || this.mainTask.settings.auto === false) {
      this.enableAutomaticAssign = !!this.mainTask.settings.auto;
    }

    this.driversCount = this.mainTask.settings.driversCount;
    this.selectedTags = this.mainTask.settings.tags;
    this.teamIds = this.mainTask.settings.teamIds;
  }

  ngOnInit() {
    this.collectLists();
  }

  /**
   * get all lists
   * 
   * 
   */
  collectLists() {
    const teams = this.listTeams();
    const tags = this.listTags();
    const drivers = this.listDrivers();
    const obsvArray = [teams, tags, drivers];

    const all = zip(...obsvArray);

    all.subscribe(result => {
      this.teams = result['0'];
      this.tags = result['1'];
      this.drivers = result['2'];

      this.tags = this.tags.filter(tag => {
        return tag != null && tag != '';
      });

      this.drivers.forEach(driver => {
        if (driver.tags) {
          let array: string[] = [];
          array = driver.tags.split(",");

          driver.tagsArray = array;
        } else {
          driver.tagsArray = [];
        }
      });

      this.tempDrivers = this.drivers;
      this.tempTeams = this.teams;

      if (this.tags.length > 0) {
        this.tempTags = this.tags;
      } else {
        this.enableTags = false;
      }

      if (this.teams.length > 0) {
        this.tempTeams = this.teams;
      } else {
        this.enableTeams = false;
      }

      if (!this.data.editMode) {
        this.getSettings();
      } else {
        this.selectedDrivers = [];
        this.selectedDrivers.push(this.data.driverId);
      }
    });
  }

  /**
   * teams
   * 
   * 
   */
  listTeams(): Observable<any> {
    return this.facadeService.teamsService.list();
  }

  /**
   * tags
   * 
   * 
   */
  listTags(): Observable<any> {
    return this.facadeService.driverService.listTags();
  }

  /**
   * drivers for assignment
   * 
   * 
   */
  listDrivers(): Observable<any> {
    return this.facadeService.driverService.driversForAssignment;
  }

  /**
   * select team
   * 
   * 
   * @param event 
   */
  onSelectTeam(event: MatRadioButton, index: number) {
    this.enableTeams = false;
    this.selectedTeam = index;

    this.drivers = this.tempDrivers;
    let final = this.drivers.filter(driver => {
      return driver.teamId == event.value;
    });
    this.drivers = final;
  }

  /**
   * close dialog
   * 
   * 
   */
  close() {
    this.dialogRef.close(
      //this.settings,
      new TaskSettingsViewModel({
        driverIds: this.selectedDrivers ? this.selectedDrivers : [],
        restrictGeofences: this.restrictGeofences,
        auto: this.enableAutomaticAssign,
        // driversCount: this.enableAutomaticAssign ? this.driversCount : this.selectedDrivers.length,
        driversCount: 1,
        tags: this.selectedTags,
        teamIds: this.teamIds
      })
    );
  }

  /**
   * select driver(s)
   * 
   * 
   * @param event 
   */
  onSelectDrivers(event) {
    if (!this.data.editMode) {
      this.selectedDrivers = event;

      if (this.selectedDrivers.length > 0) {
        this.enableAutomaticAssign = false;
      } else {
        this.enableAutomaticAssign = true;
      }
    }
  }

  /**
   * select driver
   * 
   * 
   * @param driver 
   */
  onSelect(driver: Driver) {
    if (this.data.editMode) {
      this.selectedDrivers = [];
      this.selectedDrivers.push(driver.id);
    }
  }

  onSelectTeams(event) {
    this.teamIds = event;

    this.drivers = this.tempDrivers;
    let final = this.drivers.filter(driver => {
      return this.teamIds.indexOf(driver.teamId) > -1;
    });
    this.drivers = final;
  }

  /**
   * automatic assign change
   * 
   * 
   * @param event 
   */
  onChangeAutomaticAssign(event: MatCheckboxChange) {
    this.enableAutomaticAssign = event.checked;

    if (this.enableAutomaticAssign) {
      this.selectedDrivers = [];
    }

    if (this.selectedDriver == null && this.selectedTags.length == 0 && this.selectedTags.length == 0 && !this.enableAutomaticAssign) {
      this.drivers = this.tempDrivers;
    }
  }

  /**
  * automatic assign change
  * 
  * 
  * @param event 
  */
  onChangeAllTeams(event: MatCheckboxChange) {
    this.enableTeams = event.checked;

    if (this.enableTeams) {
      this.selectedTeam = null;
      this.drivers = this.tempDrivers;
    }
  }


  /**
   * filter driver(s)
   * 
   * 
   * @param event 
   */
  onSelectTags(event) {

    let drivers: Driver[] = [];
    this.drivers = this.tempDrivers;

    // filter drivers using tags list 
    for (let index = 0; index < event.length; index++) {
      const tag: string = event[index];

      for (let index = 0; index < this.drivers.length; index++) {
        const driver = this.drivers[index];

        const check = driver.tagsArray.indexOf(tag);
        const driverFound = drivers.indexOf(driver);

        if (check != -1 && driverFound == -1) {
          drivers.push(driver);
        }
      }
    }

    // filtered drivers
    this.drivers = drivers;

    this.selectedTags = event;
    if (this.selectedTags.length > 0) {
      this.enableAutomaticAssign = false;
    }
  }

  /**
   * filter teams / drivers / tags 
   * 
   * 
   * @param event 
   * @param type 
   */
  onFilter(event: any, type: string) {
    let term: string = event.target.value;
    const checkString: boolean = term == ' ' || term == '';

    switch (type) {
      case 'drivers':
        this.selectedDrivers = [];
        if (checkString) {
          this.drivers = this.tempDrivers;
        }

        this.drivers = this.tempDrivers.filter(driver => {
          return driver.name.indexOf(term) >= 0;
        });
        break;

      case 'teams':
        this.selectedTeam = null;
        if (checkString) {
          this.teams = this.tempTeams;
        }

        this.teams = this.tempTeams.filter(team => {
          return team.name.indexOf(term) >= 0;
        });
        break;

      case 'tags':
        this.selectedTags = [];
        if (checkString) {
          this.tags = this.tempTags;
        }

        this.tags = this.tempTags.filter(tag => {
          return tag.indexOf(term) >= 0;
        });
        break;
      default:
        break;
    }
  }

  getSettings() {
    //isEnable
    this.facadeService.autoAllocationService.getSettingsByKey("IsEnableAutoAllocation").subscribe((result: AutoAllocation) => {
      this.settingEnableAutoAllocation = result;
      if (this.settingEnableAutoAllocation == undefined || this.settingEnableAutoAllocation == null) {
        ///no settings Selected by default will send unassign
        this.isDefaultEnableAutoAllocation = false;
        this.enableAutomaticAssign = false;
      } else if (this.settingEnableAutoAllocation.value == "true") {
        this.isDefaultEnableAutoAllocation = true;
        this.enableAutomaticAssign = true;
      } else {
        this.isDefaultEnableAutoAllocation = false;
        this.enableAutomaticAssign = false;
      }

      if (this.mainTask && this.mainTask.tasks && this.mainTask.tasks[0] && this.mainTask.tasks[0].longitude && this.mainTask.tasks[0].latitude) {
        this.facadeService.mainTaskService.taskHasGeofences(this.mainTask).subscribe(res => {
          this.disableSelectGeofences = !res.hasGeofences;
          if (!this.disableSelectGeofences) this.restrictGeofences = true;
          this.loadSettings();
        });
      } else {
        this.loadSettings();
      }
    });
  }

}
