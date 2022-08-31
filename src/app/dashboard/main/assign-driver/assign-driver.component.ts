import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacadeService } from '@dms/services/facade.service';
import { MatSlideToggleChange, MatSelect } from '@angular/material';
import { Team } from '@dms/models/settings/Team';
import { Driver } from '@dms/models/settings/Driver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.scss']
})
export class AssignDriverComponent implements OnInit {

  // statusList: TaskStatus[];
  form: FormGroup;

  teams: Team[] = [];
  drivers: Driver[] = [];
  allDrivers: Driver[] = [];

  checked: boolean = false;
  label: string;

  @ViewChild('teamsSelectList', { static: true }) teamsSelectList: MatSelect;

  /**
   * 
   * @param dialogRef 
   * @param data 
   * @param facadeService 
   */
  constructor(public dialogRef: MatDialogRef<AssignDriverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    private fb: FormBuilder,
    private translateService: TranslateService) {
    this.label = this.translateService.instant('Reassign task');
  }

  ngOnInit() {
    this.label = this.data.label;

    this.form = this.fb.group({
      mainTaskId: [this.data['taskId']],
      teamId: [this.data['teamId']],
      driverIds: [this.data['driverIds'], [Validators.required]]
    });

    this.listDrivers();
    this.listTeams();

    // this.facadeService.taskStatusService.list().subscribe(status => {
    //   this.statusList = status;
    // });

    this.teamsSelectList.valueChange.subscribe(id => {
      this.filterDrivers(id);
    });
  }

  filterDrivers(id: number) {
    this.form.get('driverIds').setValue(null);
    let array = [];
    array = this.allDrivers;
    this.drivers = array.filter(team => team.teamId == id);
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

      if (this.data['teamId']) {
        this.filterDrivers(this.data['teamId']);
        this.form.get('driverIds').setValue(this.data['driverIds']);
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * on change geo fence
   * 
   *  
   * @param event 
   * @todo when value is true call anther api to fetch drivers/agents via region then replace drivers list with it also make all of them.
   */
  onChangeToggle(event: MatSlideToggleChange) {
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

    delete this.form.value['teamId'];
    this.facadeService.mainTaskService.reassignMainTask(this.form.value).subscribe(t => {
      this.dialogRef.close();
    });
  }
}
