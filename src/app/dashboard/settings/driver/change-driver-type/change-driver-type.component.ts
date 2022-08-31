import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FacadeService } from '@dms/services/facade.service';
import { AgentType } from '@dms/models/settings/AgentType';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-driver-type',
  templateUrl: './change-driver-type.component.html',
  styleUrls: ['./change-driver-type.component.scss']
})
export class ChangeDriverTypeComponent implements OnInit {

  form: FormGroup;
  agentTypes: AgentType[] = [];

  constructor(public dialogRef: MatDialogRef<ChangeDriverTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private facadeService: FacadeService,
    private translateService:TranslateService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.getAgentTypes();
  }

  initForm() {
    this.form = this.fb.group({
      agentTypeId: [null, [Validators.required]],
      driverIds: [this.data['driverIds']]
    });
  }

  getAgentTypes() {
    this.facadeService.agentTypeService.list().subscribe(agentTypes => {
      this.agentTypes = agentTypes;
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.facadeService.driverService.bulkChangeDriversType(this.form.value).subscribe(t => {
        this.dialogRef.close(this.form.value);
      });
    }
  }

  /**
   * close
   */
  cancel() {
    this.dialogRef.close();
  }

}
