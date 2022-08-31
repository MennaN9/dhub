import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { Task } from '@dms/app/models/main/tasks/Task';
import { Lightbox } from 'ngx-lightbox';
import { App } from '@dms/app/core/app';

@Component({
  selector: 'app-order-progress',
  templateUrl: './order-progress.component.html',
  styleUrls: ['./order-progress.component.scss']
})
export class OrderProgressComponent implements OnInit {

  task: Task;

  displayedColumns: string[] = ['dateTime', 'status', 'driverName', 'attachment', 'reason', 'location'];
  dataSource: any;
  readonly baseUrl = App.backEndUrl;
  hideDriverColumn: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<OrderProgressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lightbox: Lightbox,
  ) {
    this.task = this.data.task;
    this.hideDriverColumn = this.data.hideDriverColumn;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.task['taskHistories']);
  }

  /**
   * close dialog
   *
   *
   */
  cancel() {
    this.dialogRef.close();
  }

  closeLightBox(): void {
    this.lightbox.close();
  }

  /**
   * image view
   * 
   * 
   * @param index 
   */
  openTaskSignaturesLightBox(src: string, caption?: string): void {
    const imageTodisplay = {
      src: `${this.baseUrl}/${src}`,
      caption: caption,
      thumb: src
    };

    let array: any[] = [];
    array.push(imageTodisplay);

    this.lightbox.open(array, 0);
  }

  /**
* image view
* 
* 
* @param index 
*/
  openTasksGalleryLightBox(images: [], caption?: string): void {
    let array: any[] = [];
    if (images.length > 0) {
      images.forEach((image: any) => {
        const imageTodisplay = {
          src: `${this.baseUrl}/${image.fileURL}`,
          caption: caption,
          thumb: image.fileURL
        };

        array.push(imageTodisplay);
      });

      this.lightbox.open(array, 0);
    }
  }

}
