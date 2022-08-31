import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Team } from '@dms/app/models/teams';
import { Driver } from '@dms/app/models/settings/Driver';
import { MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reassign-driver',
  templateUrl: './reassign-driver.component.html',
  styleUrls: ['./reassign-driver.component.scss']
})
export class ReassignDriverComponent implements OnInit {

  form: FormGroup;
  teams: Team[] = [];
  drivers: Driver[] = [];
  allDrivers: Driver[] = [];

  checked: boolean = false;
  connectedTasks: boolean = false;
  locale: string;

  @ViewChild('teamsSelectList', { static: true }) teamsSelectList: MatSelect;

  /**
   *
   * @param dialogRef
   * @param data
   * @param facadeService
   */
  constructor(public dialogRef: MatDialogRef<AssignDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private facadeService: FacadeService,
    private translateService: TranslateService,
    private fb: FormBuilder, private snackBar: SnackBar) {
    this.facadeService.languageService.language.subscribe(lng => {
      this.locale = lng;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      mainTaskId: [this.data['taskId']],
      newDriverId: ['', [Validators.required]]
    });

    this.listDrivers();
    this.listTeams();

    this.teamsSelectList.valueChange.subscribe(id => {
      this.form.get('newDriverId').setValue(null);
      let array = [];
      array = this.allDrivers;
      this.drivers = array.filter(team => team.teamId == id);
    });
  }

  /**
   * teams
   *
   *
   */
  listTeams() {
    this.facadeService.teamsService.list().subscribe(teams => {
      this.teams = teams;
    });
  }

  /**
   * drivers
   *
   *
   */
  listDrivers() {
    this.facadeService.driverService.list().subscribe(drivers => {
      this.allDrivers = drivers.filter(d => d.agentStatusId != 5);
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * assign driver
   *
   *
   */
  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    let body = this.form.value;

    body['oldDriverId'] = this.data['driverId'];
    body['taskStatusIds'] = [this.data['driverStatusId']];

    this.facadeService.taskService.reasignDriverTasks(body).subscribe(result => {
      const message: Body = {
        message: this.translateService.instant(`Success driver has been reasigned !`),
        action: this.translateService.instant(`Okay`),
        duration: 2000
      }

      this.snackBar.openSnackBar(message);
      this.dialogRef.close();
    });
  }
}

