import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { App } from '@dms/app/core/app';
import { BulkUploadShipmentService } from '@dms/app/services/settings/bulk-upload-shipment.service';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-bulk-upload-shipment-details',
  templateUrl: './bulk-upload-shipment-details.component.html',
  styleUrls: ['./bulk-upload-shipment-details.component.scss']
})
export class BulkUploadShipmentDetailsComponent implements OnInit {

  displayedColumns: string[] = ['dateTime','fileName', 'createdBy', 'actions'];
  dataSource;
  page: number = 1;
  itemsPerPage: number = 10;
  backendUrl: string = `${App.backEndUrl}/`;
  length: number = 0;

  constructor(
    private bulkUploadShipmentService: BulkUploadShipmentService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.files(this.page);
  }

  opnenBulkUpload() {
    const dialogRef = this.dialog.open(BulkUploadComponent, {
      width: '40%',
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {

      this.page = 1;
      this.files(this.page);
    });
  }

  files(page: number): void {
    const body = {
      pageNumber: page,
      pageSize: this.itemsPerPage,
    };

    this.bulkUploadShipmentService.list(body).subscribe((res: any) => {
      this.dataSource = res.result;
      this.length = res.totalCount;
    });
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.page = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.files(this.page)
  }
}
