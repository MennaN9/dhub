import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../../../services/facade.service';
import { MatDialogRef } from '@angular/material';
import { saveFile } from '@dms/app/utilities/generate-download-file';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-import-customers',
  templateUrl: './import-customers.component.html',
  styleUrls: ['./import-customers.component.scss']
})
export class ImportCustomersComponent implements OnInit {

  files: File[] = [];

  /**
   *
   * @param facadeService
   * @param dialogRef
   */
  constructor(private facadeService: FacadeService, private snackBar: SnackBar, private translateService: TranslateService,
    public dialogRef: MatDialogRef<ImportCustomersComponent>
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
      this.facadeService.customerService.importFromExcel(this.files[0], file['name']).subscribe(uploadResult => {
        

        this.snackBar.openSnackBar({
          message: this.translateService.instant(`Imported successfully`)
          , action: this.translateService.instant(`okay`), duration: 2500
        });

        if (uploadResult instanceof Blob) {
          saveFile("FaildCustomers.csv", "data:attachment/text", uploadResult);
        }

        this.dialogRef.close();
      }, (err) => {
        if (err.error.text) {
          saveFile("FaildCustomers.csv", "data:attachment/text", err.error.text);
        }
        console.log(err)
      });
    });
  }

  isValidExtenstion(file): boolean {
    const filename = file.name;
    const extensionImg = filename.substr(filename.lastIndexOf('.') + 1);
    const validExtensions: string[] = ['xls', 'xlsx'];
    return validExtensions.some(x => x === extensionImg);
  }

  /**
   * download template
   *
   *
   */
  downloadTemplete() {
    this.facadeService.customerService.downloadTemplate.subscribe(data => {
      saveFile("CustomersTemplate.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;", data);
    })
  }
}
