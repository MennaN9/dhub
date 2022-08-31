import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacadeService } from '@dms/app/services/facade.service';

export interface Dialog {
  title: string;
  message: string;
  openBtn: string;
  cancelBtn: string;
  okayBtn: string;
  icon: string;
}

@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.scss']
})
export class ConfirmDeletionComponent {

  @Input() dialogContent: Dialog;
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();
  locale: string = 'en';

  constructor(public dialog: MatDialog, private facadeService: FacadeService) {
    this.facadeService.languageService.language.subscribe(lng => {
      this.locale = lng;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverview, {
      width: '500px',
      minHeight: '150px',
      data: this.dialogContent,
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirm.emit(result);
      } else {
        this.confirm.emit(false);
      }
    });
  }
}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: './dialog-overview.html',
  styleUrls: ['./confirm-deletion.component.scss']
})

export class DialogOverview {

  constructor(
    public dialogRef: MatDialogRef<DialogOverview>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog) {
  }

  /**
   * cancel dialog
   * 
   * 
   */
  cancel(): void {
    this.dialogRef.close();
  }
}
