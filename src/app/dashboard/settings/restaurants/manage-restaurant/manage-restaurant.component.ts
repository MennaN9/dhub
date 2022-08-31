import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-restaurant',
  templateUrl: './manage-restaurant.component.html',
  styleUrls: ['./manage-restaurant.component.scss']
})
export class ManageRestaurantComponent implements OnInit {
  isSubmitted: boolean = false;
  form: FormGroup;
  formTitle: string;
  formAction: string;

  /**
   * 
   * @param dialogRef 
   * @param data 
   * @param facadeService 
   * @param translateService 
   * @param fb 
   */
  constructor(
    public dialogRef: MatDialogRef<ManageRestaurantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      id: [0],
      name: [null, [Validators.required]],
    });

    if (data.type == 'edit' && data.restaurant)
      this.form.patchValue(this.data.restaurant, { emitEvent: true, onlySelf: true })

    if (this.data.type == 'edit') {
      this.formAction = this.translateService.instant(`Update`);
      this.formTitle = this.translateService.instant(`Edit`);
    } else {
      this.formTitle = this.translateService.instant(`Add`);
      this.formAction = this.translateService.instant(`Create`);
    }
  }

  ngOnInit() {
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
   * edit / create
   *
   *
   */
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      this.isSubmitted = false;
      return;
    }

    let form = this.form.value;
    switch (this.data.type) {
      case 'create':
        this.facadeService.restaurantService.create(form).subscribe(res => {
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        });
        break;

      case 'edit':
        form['isActive'] = this.data.restaurant.isActive;
        this.facadeService.restaurantService.update(form).subscribe(res => {
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        });
        break;

      default:
        break;
    }

  }

  /**
   * check if form input has an error
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'name':
        if (this.form.get('name').hasError('required')) {
          return this.translateService.instant(`Name required`);
        }
        break;

      default:
        break;
    }
  }
}
