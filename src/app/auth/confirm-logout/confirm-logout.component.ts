import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';

@Component({
  selector: 'app-confirm-logout',
  templateUrl: './confirm-logout.component.html',
  styleUrls: ['./confirm-logout.component.scss']
})
export class ConfirmLogoutComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmLogoutComponent>,
    private facadeService: FacadeService) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(false);
  }

  logoutUserSession() {
    const id: string = this.data.userId;
    this.facadeService.accountService.logoutSession(id).subscribe(res => {
      this.dialogRef.close(true);
    });
  }
}
