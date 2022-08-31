import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { Location } from '@dms/models/teams';
import { SnackBar, Body } from '@dms/utilities/snakbar';
import { Place } from '@dms/app/models/general/place';
import { TranslateService } from '@ngx-translate/core';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {
  isSubmitted: boolean = false;
  form: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  tags: string[] = [];
  locations: Location[] = [];

  formTitle: string;
  formAction: string;
  places: any[] = []
  selectedBefore: boolean = false;
  selectedPlace: Place;
  addressValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<ManageTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {
    this.form = fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      address: [''],
      tagsCtrl: [''],
      locationAccuracyId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.data.type == 'edit') {
      this.formAction = this.translateService.instant(`Update`);
      this.formTitle = this.translateService.instant(`Edit`);

      let team = this.data.team;
      let tags = this.data.team.tags;
      if (tags !== null && tags !== 'null') {
        this.tags = tags.split(',');
      }

      this.form.patchValue(team);
      this.addressValue = team.address;
      this.selectedBefore = true;
    } else {
      this.formTitle = this.translateService.instant(`Add`);
      this.formAction = this.translateService.instant(`Create`);
    }

    this.locations = this.data.locations;
  }

  /**
   * add new tag
   *
   *
   * @param event MatChipInputEvent
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.findElement(this.tags, value.trim())) {
        this.tags.push(value.trim());
      } else {
        this.snackBar.openSnackBar({
          message:
            this.translateService.instant(`Tag exists before`),
          action: this.translateService.instant(`okay`), duration: 2500
        });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * remove tag
   *
   *
   * @param tag
   */
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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
   * edit / create new team depends on type
   *
   *
   */
  onSubmit() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.isSubmitted = false;
      return;
    }

    let body = this.form.value;
    // if (this.data.type == 'edit') {
    //   body['address'] = body['address'] ? body['address'] : this.data.team.address;
    // }
    body['tags'] = this.tags.length > 0 ? this.tags.toString() : null;
    body['address'] = typeof (body['address']) === 'object' ? body['address'].formatted_address : body['address'];

    switch (this.data.type) {
      case 'add':
        this.facadeService.teamsService.create(body).subscribe(team => {
          const message: Body = {
            message: this.translateService.instant('Team has been added successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);
          this.dialogRef.close({ data: team });
        }, error => {
          this.isSubmitted = false;
        });
        break;

      case 'edit':
        body['id'] = this.data.team.id;
        this.facadeService.teamsService.update(body).subscribe(team => {
          const message: Body = {
            message: this.translateService.instant('Team has been updated successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);

          this.dialogRef.close({ data: body, type: this.data.type });
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

        if (this.form.get('name').hasError('whitespace')) {
          return this.translateService.instant(`Name required`);
        }
        break;

      case 'tagsCtrl':
        if (this.form.get('tagsCtrl').hasError('required')) {
          return this.translateService.instant(`Tags required`);
        }
        break;

      case 'locationAccuracyId':
        if (this.form.get('locationAccuracyId').hasError('required')) {
          return this.translateService.instant(`location Accuracy required`);
        }
        break;

      default:
        return '';
    }
  }

  /**
   *
   * @param array
   * @param word
   */
  findElement(array: string[], word: string): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i].toLocaleLowerCase() === word.toLocaleLowerCase()) {
        return true;
      }
    }
  }

  /**
   *
   * @param control
   */
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  /**
   *
   * @param event
   * @param type
   * @param index
   */
  addressClicked(event: any) {
    this.selectedPlace = {
      lat: event.latitude,
      lon: event.longitude,
    };

    this.selectedBefore = true;
  }

  /**
   * check if selected option before to get lat & lng
   *
   *
   */
  checkAddress() {
    if (!this.selectedBefore) {
      this.form.get('address').setValue(null);
      this.selectedPlace = null;
    }
  }

  /**
   *
   * @param event
   */
  onChangeText(event: any) {
    const keywords: string = event.target.value;
    if (keywords.trim() == '') {
      this.form.get('address').setValue(null);
    }
  }
}
