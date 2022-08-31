import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacadeService } from '@dms/services/facade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { TaskstatusService } from "@dms/services/state-management/taskstatus.service";

@Component({
  selector: 'app-change-task-status',
  templateUrl: './change-task-status.component.html',
  styleUrls: ['./change-task-status.component.scss']
})
export class ChangeTaskStatusComponent implements OnInit {
  form: FormGroup;
  isShowReason: boolean = false;
  statusList: any[] = [];

  /**
   *
   * @param dialogRef
   * @param data
   * @param facadeService
   * @param fb
   */
  constructor(
    public dialogRef: MatDialogRef<ChangeTaskStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private facadeService: FacadeService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private taskstatusService: TaskstatusService
  ) {
    this.form = this.fb.group({
      statusId: ['', [Validators.required]],
      reason: [''],
      isChangeConnectedTasks: [false]
    });
    this.form.patchValue({ statusId: this.data['taskStatusId'], isChangeConnectedTasks: this.data['isConnectedTasks'] });
  }

  ngOnInit() {
    this.listStatus();
  }

  /**
   * list status
   *
   *
   */
  listStatus() {
    this.facadeService.taskStatusService.list().subscribe(status => {

      if (this.data['taskStatusId'] == 1) {
        this.statusList = status.filter(x => x.id < 2 || x.id > 6);
      } else {
        this.statusList = status.filter(x => x.id > 1);
      }

      let event: MatSelectChange = new MatSelectChange(null, this.data['taskStatusId']);

      this.checkReason(event);

    });
  }

  /**
   * check type
   * 
   * 
   */
  checkReason(event: MatSelectChange): void {
    const statusID = event.value;

    const status = this.statusList.find(a => a.id == statusID);
    if (status && status.name == "Cancelled" || status.name == "Failed" || status.name == "Declined") {
      this.isShowReason = true;
      this.form.get('reason').setValidators([Validators.required]);
    } else {
      this.isShowReason = false;
      this.form.get('reason').clearValidators();
    }

    this.form.get('reason').updateValueAndValidity();
  }

  /**
   * change status
   *
   *
   */
  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const body = {
      id: this.data['taskId'],
      statusId: this.form.value['statusId'],
      reason: this.form.value['reason'],
      isChangeConnectedTasks: this.form.value['isChangeConnectedTasks']
    };

    this.facadeService.taskService.changeStatus(body).subscribe(res => {
      this.taskstatusService.changeStatus(true);
      this.dialogRef.close();
    });
  }

  /**
   * close dialog
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
  getError(input: string) {
    if (input == 'reason' && this.form.get('reason').hasError('required')) {
      return this.translateService.instant(`Reason required`);
    }
  }

}
