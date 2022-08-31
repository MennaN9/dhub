import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-block-branch',
  templateUrl: './block-branch.component.html',
  styleUrls: ['./block-branch.component.scss']
})
export class BlockBranchComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BlockBranchComponent>,
    private facadeService: FacadeService,
    private fb: FormBuilder,
    private snackBar: SnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      reason: ['', [Validators.required]],
    });

  }

  cancel(): void {
    this.dialogRef.close();
  }

  /**
  * confirm block driver
  *
  *
  * @param event
  */
  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const body = {
      id: this.data.branchId,
      isActive: false,
      reason: this.form.get('reason').value
    }

    this.facadeService.branchService.blockUnBlockBranch(body).subscribe(res => {
      const message: Body = {
        message: this.translateService.instant('Success branch has been blocked !'),
        action: this.translateService.instant('Okay'),
        duration: 2000
      }
      this.snackBar.openSnackBar(message);
      this.dialogRef.close({ data: true });
    });
  }


  /**
   * check if form input has an error
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'reason':
        if (this.form.get('reason').hasError('required')) {
          return this.translateService.instant('Reason required');
        }
        break;

      default:
        return '';
    }
  }

}
