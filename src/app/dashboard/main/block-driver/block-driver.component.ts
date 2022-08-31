import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-block-driver',
  templateUrl: './block-driver.component.html',
  styleUrls: ['./block-driver.component.scss']
})
export class BlockDriverComponent implements OnInit {
  driverId: number;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BlockDriverComponent>,
    private facadeService: FacadeService,
    private fb: FormBuilder,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.driverId = this.data['driverId'];
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
      driverId: this.driverId,
      reason: this.form.get('reason').value
    }

    this.facadeService.driverService.block(body).subscribe(res => {
      const message: Body = {
        message: this.translateService.instant(`Success driver has been blocked !`),
        action: this.translateService.instant(`Okay`),
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
          return this.translateService.instant(`Reason required`);
        }
        break;

      default:
        return '';
    }
  }
}
