import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { BulkUploadShipmentService } from '@dms/app/services/settings/bulk-upload-shipment.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  files: File[] = [];

  constructor(
    private bulkUploadShipmentService: BulkUploadShipmentService,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<BulkUploadComponent>
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * select files
   *
   *
   * @param event
   */
  onSelect(event: any) {
    this.files = [];
    this.files.push(...event.addedFiles);
  }

  /**
   * import files
   *
   *
   */
  import() {
    var file: File = this.files[0];

    if (!file) {
      this.snackBar.openSnackBar({
        message: this.translateService.instant(`No file selected, please upload file`)
        , action: this.translateService.instant(`okay`), duration: 2500
      });
      return;
    }

    if (!this.isValidExtenstion(file)) {
      this.snackBar.openSnackBar({
        message: this.translateService.instant(`Please upload xlsx format Only`)
        , action: this.translateService.instant(`okay`), duration: 2500
      });
      return;
    }

    const filePromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve(<string>reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    filePromise.then(file => {
      this.bulkUploadShipmentService.create(this.files[0], file['name']).subscribe(uploadResult => {
        this.snackBar.openSnackBar({
          message: this.translateService.instant(`Imported successfully`)
          , action: this.translateService.instant(`okay`), duration: 2500
        });

        this.dialogRef.close();
      }, (err) => {
        if (err.error.text) {
          saveFile("Faild Files.csv", "data:attachment/text", err.error.text);
        }
      });
    });
  }

  isValidExtenstion(file: File): boolean {
    const filename = file.name;
    const extensionImg = filename.substr(filename.lastIndexOf('.') + 1);
    const validExtensions: string[] = ['xls', 'xlsx'];
    return validExtensions.some(ext => ext === extensionImg);
  }
}
