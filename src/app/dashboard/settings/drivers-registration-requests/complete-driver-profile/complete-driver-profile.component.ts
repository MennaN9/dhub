import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatButtonToggleChange } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { SnackBar } from '@dms/utilities/snakbar';
import { DriverRegistrationRequestsService } from '@dms/app/services/settings/driver-registration-requests.service';

// models
import { App } from '@dms/app/core/app';
import { Country } from '@dms/app/models/settings/Country';
import { AgentType } from '@dms/app/models/settings/AgentType';
import { Driver } from '@dms/app/models/settings/Driver';
import { Team } from '@dms/app/models/settings/Team';
import { TransportType, } from '@dms/app/models/settings/TransportType';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { TranslateService } from '@ngx-translate/core';

export interface Code {
  name: string;
  code: string;
}

@Component({
  selector: 'app-complete-driver-profile',
  templateUrl: './complete-driver-profile.component.html',
  styleUrls: ['./complete-driver-profile.component.scss']
})
export class CompleteDriverProfileComponent implements OnInit, AfterViewInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  isSubmitted: boolean = false;
  countries: Country[] = [];
  transportTypes: TransportType[] = [];
  agentTypes: AgentType[] = [];
  teams: Team[] = [];
  driver: Driver;
  agentAccesses: string[];

  // errorMessage: any;
  // phone: any;
  // label: string;
  fences: any[];
  form: FormGroup;
  // panelOpenState = false;
  // isError: boolean = false;
  // visible: boolean = true;
  // selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  tags: string[] = [];
  selectedTransportionType;
  numberMessage: string;

  accept = 'image/*';
  ImageURL = App.driverImagesUrl;
  imageBase64: string = '';
  previousCountryId: number;
  selectedCountry: Country;
  type: string = 'password';
  personalPhotoSrc: string;

  constructor(
    public dialogRef: MatDialogRef<CompleteDriverProfileComponent>,
    private facadeService: FacadeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    fb: FormBuilder,
    private snackBar: SnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private driverRegistrationRequestsService: DriverRegistrationRequestsService
  ) {
    this.form = fb.group({
      DriverRegistrationId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern('[\\w\\d]*')]],
      email: ['', [Validators.email, Validators.required]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      teamId: ['', [Validators.required]],
      agentTypeId: ['', [Validators.required]],
      transportDescription: [''],
      licensePlate: [''],
      color: [''],
      roleName: ['', [Validators.required]],
    });

    this.personalPhotoSrc = this.data.personalPhotoSrc;
  }

  ngOnInit() {
    this.getTransportTypes();
    this.getAgentType();
    this.getAccessControl();
    this.getTeams();
    this.form.patchValue({
      ...this.data.requestDetails,
      DriverRegistrationId: this.data.requestDetails.id,
      firstName: this.data.requestDetails.fullName,
      color: this.data.requestDetails.transportColor,
      transportDescription: this.data.requestDetails.transportYearAndModel
    });
    this.selectedTransportionType = this.data.requestDetails.transportTypeId;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getTeams() {
    this.facadeService.teamsService.list().subscribe((result: Team[]) => {
      this.teams = result;
    });
  }

  getAccessControl() {
    this.facadeService.agentAccessControlService.list().subscribe((rolePermissions: any[]) => {
      this.agentAccesses = rolePermissions.map(role => role.roleName);
    });
  }

  getTransportTypes() {
    this.facadeService.TransportTypeService.list().subscribe((result: TransportType[]) => {
      this.transportTypes = result;
    });
  }

  getAgentType() {
    this.facadeService.agentTypeService.list().subscribe((result: AgentType[]) => {
      this.agentTypes = result;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const body = {
      ...this.form.value,
      transportTypeId: this.selectedTransportionType
    };
    this.driverRegistrationRequestsService.approve(body).subscribe(res => {
      this.snackBar.openSnackBar({
        action: this.translateService.instant('Okay'),
        duration: 2500,
        message: this.translateService.instant('Request has been approved successfully')
      })
      this.dialog.closeAll();
    });
  }

  /**
   * validate number with code using google-libphonenumber
   *
   *
   */
  validateNumberWithCode(): boolean {
    this.numberMessage = '';
    if (this.selectedCountry && this.selectedCountry.topLevel) {
      let number: string = this.form.value['PhoneNumber'];
      const phoneNumber = CompleteDriverProfileComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
      const validNumber = CompleteDriverProfileComponent.phoneNumberUtil.isValidNumber(phoneNumber);

      if (!validNumber) {
        this.numberMessage = 'Not valid number';

        this.isSubmitted = true;
        return false;
      }
      else {
        this.isSubmitted = false;

      }
    } else {
      this.snackBar.openSnackBar({
        message: this.translateService.instant(`Please Select Country Code`)
        , duration: 2500, action:
          this.translateService.instant(`OKay`)
      });
      this.isSubmitted = true;
      return false;
    }
  }

  onChangeType(event: MatButtonToggleChange) {
    this.selectedTransportionType = event.value;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (!this.findElement(this.tags, value.trim())) {
        this.tags.push(value.trim());
      } else {
        this.snackBar.openSnackBar({
          message: this.translateService.instant(`Tag exists before`)
          , action:
            this.translateService.instant(`okay`), duration: 2500
        });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getError(input: string) {
    switch (input) {
      case 'fullName':
        if (this.form.get('fullName').hasError('required')) {
          return this.translateService.instant(`Full Name Name required`);
        }
        break;
      case 'roleName':
        if (this.form.get('roleName').hasError('required')) {
          return this.translateService.instant(`Role Name required`);
        }
        break;
      case 'userName':
        if (this.form.get('userName').hasError('required')) {
          return this.translateService.instant(`Username required`);
        }
        if (this.form.get('userName').hasError('pattern')) {
          return this.translateService.instant(`letters and digits only allowed`);
        }
        break;

      case 'email':
        if (this.form.get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        if (this.form.get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }
        break;

      case 'phoneNumber':
        if (this.form.get('phoneNumber').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;

      case 'tags':
        if (this.tags.length == 0) {
          return this.translateService.instant(`Tags required`);
        }
        break;

      case 'agentTypeId':
        if (this.form.get('agentTypeId').hasError('required')) {
          return this.translateService.instant(`Agent Type required`);
        }
        break;

      case 'licensePlate':
        if (this.selectedTransportionType !== 'walk' && this.selectedTransportionType !== 'cycle') {
          return this.translateService.instant(`License Plate required`);
        }

        if (this.form.get('licensePlate').hasError('pattern')) {
          return this.translateService.instant(`License Plate required`);
        }
        break;

      case 'color':
        if (this.selectedTransportionType !== 'walk' && this.selectedTransportionType !== 'cycle') {
          return this.translateService.instant(`Color required`);
        }

        if (this.form.get('color').hasError('pattern')) {
          return this.translateService.instant(`License Plate required`);
        }
        break;
      case 'teamId':
        if (this.form.get('teamId').hasError('required')) {
          return this.translateService.instant(`Team required`);
        }
        break;
      case 'password':
        if (this.form.get('password').hasError('required')) {
          return this.translateService.instant(`Password required`);
        }
        if (this.form.get('password').hasError('minlength')) {
          return this.translateService.instant(`At least 6 Characters`);
        }
        break;
      default:
        return '';
    }
  }

  onChangeCountry(counrty: Country) {
    this.selectedCountry = counrty;
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
        });
      }
    });
  }

  findElement(array: string[], word: string): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i].toLocaleLowerCase() === word.toLocaleLowerCase()) {
        return true;
      }
    }
  }

  validate(control: FormControl): { whitespace: boolean } {
    const valueNoWhiteSpace = control.value.trim();
    const isValid = valueNoWhiteSpace === control.value;
    return isValid ? null : { whitespace: true };
  }

  /**
 * password to text and inverse
 *
 *
 */
  togglePassword() {
    if (this.type == 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
