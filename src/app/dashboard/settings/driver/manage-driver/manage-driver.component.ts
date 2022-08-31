import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatButtonToggleChange } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';

// models
import { App } from '@dms/app/core/app';
import { Country } from '@dms/app/models/settings/Country';
import { AgentType } from '@dms/app/models/settings/AgentType';
import { Driver } from '@dms/app/models/settings/Driver';
import { Team } from '@dms/app/models/settings/Team';
import { TransportType, } from '@dms/app/models/settings/TransportType';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from '@dms/app/constants/routes';


export interface Code {
  name: string;
  code: string;
}

@Component({
  selector: 'app-manage-driver',
  templateUrl: './manage-driver.component.html',
  styleUrls: ['./manage-driver.component.scss']
})
export class ManageDriverComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  isSubmitted: boolean = false;
  countries: Country[] = [];
  transportTypes: TransportType[] = [];
  agentTypes: AgentType[] = [];
  teams: Team[] = [];
  driver: Driver;
  agentAccesses: string[];

  errorMessage: any;
  type: string = 'password';
  phone: any;
  label: string;
  fences: any[];
  form: FormGroup;

  editMode: boolean;
  panelOpenState = false;
  isError: boolean = false;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  tags: string[] = [];
  selectedTransportionType;
  numberMessage: string;

  accept = 'image/*';
  ImageURL = App.driverImagesUrl;
  imageBase64: string = '';
  dispalyImage: string = 'assets/images/users/avatar.png';
  previousCountryId: number;
  selectedCountry: Country;

  formAction: string = '';
  formTitle: string = '';
  codeError: string = '';
  formFile: File;

  registrationRoute: string = '';

  /**
   *
   * @param dialogRef
   * @param facadeService
   * @param data
   * @param fb
   * @param snackBar
   */
  constructor(
    public dialogRef: MatDialogRef<ManageDriverComponent>,
    private facadeService: FacadeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService,
    fb: FormBuilder,
    private snackBar: SnackBar
  ) {
    this.form = fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: [''],
      email: ['', [Validators.email, Validators.required]],
      phoneNumber: ['', Validators.required],
      teamId: ['', [Validators.required]],
      agentTypeId: ['', [Validators.required]],
      transportDescription: [''],
      licensePlate: [''],
      color: [''],
      roleName: ['', [Validators.required]],
      driverDeliveryGeoFences: [['All']],
      driverPickUpGeoFences: [['All']]
    })

    this.selectedTransportionType = 'walk';

  }

  ngOnInit() {
    this.getTeams();
    this.getTransportTypes();
    this.getAgentType();
    this.getAccessControl();
    this.getGeoFence();

    if (this.isEditMode) {
      this.formAction = this.translateService.instant('Update');
      this.formTitle = this.translateService.instant('Edit');
      this.fillFormData();


    } else {
      this.formTitle = this.translateService.instant(`Add`);
      this.formAction = this.translateService.instant(`Create`);
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  /**
   * user permissons
   *
   *
   */
  getAccessControl() {
    this.facadeService.agentAccessControlService.list().subscribe((rolePermissions: any[]) => {
      this.agentAccesses = rolePermissions.map(role => role.roleName);

      if (this.isEditMode && this.data.driver.roleNames[0]) {
        this.form.get('roleName').setValue(this.data.driver.roleNames[0]);
      }
    });
  }

  /**
   * check if edit mode
   *
   *
   */
  get isEditMode(): boolean {
    if (this.data.operation.toLocaleLowerCase() == 'edit') {
      return true;
    }
  }

  /**
  * Fill form with driver data in edit mode.
  *
  *
  */
  fillFormData() {
    this.driver = this.data['driver'];
    this.previousCountryId = this.driver.countryId;

    let driverRegistrationId = this.data['driver'].driverRegistrationId;

    if (driverRegistrationId != null) {
      this.registrationRoute = "#" + Routes.driversRegistrationRequestsViewDetails + "/" + driverRegistrationId;
    }

    this.form.patchValue(this.driver);

    if (this.driver.imageUrl != null) {
      this.dispalyImage = this.ImageURL + this.driver.imageUrl;
    }

    if (this.driver.tags != null) {
      this.tags = this.driver.tags.split(',').filter(tag => tag !== '');
    }

    if (this.driver.allDeliveryGeoFences) {
      this.form.patchValue({ driverPickUpGeoFences: ['All'] });
    }

    if (this.driver.allDeliveryGeoFences) {
      this.form.patchValue({ driverDeliveryGeoFences: ['All'] });
    }
  }

  /**
   * Fetch all teams
   *
   *
   */
  getTeams() {
    this.facadeService.teamsService.list().subscribe((result: Team[]) => {
      this.teams = result;
    });
  }

  /**
  * Fetch all transportTypes
  *
  *
  */
  getTransportTypes() {
    this.facadeService.TransportTypeService.list().subscribe((result: TransportType[]) => {
      this.transportTypes = result;

      if (this.isEditMode) {
        this.selectedTransportionType = this.driver.transportTypeName.toLocaleLowerCase();
      }
    });
  }


  /**
   * Fetch all geo fences
   *
   *
   */
  getGeoFence() {
    this.facadeService.geoFenceService.list().subscribe(result => {

      if (result) {
        this.fences = result.map(zone => {
          return {
            geoFenceId: zone['id'],
            geoFenceName: zone['name']
            //driverId: null,
            //id: null
          }
        });

        if (this.isEditMode) {
          let selectedPZones = [];
          this.driver.driverPickUpGeoFences.forEach(z => {
            const zone = this.fences.find(zone => zone.geoFenceId == z.geoFenceId);
            if (zone) {
              //zone.driverId = z.driverId;
              //zone.id = z.id;
              selectedPZones.push(zone);
            }
          });

          if (this.driver.allPickupGeoFences) {
            this.form.get("driverPickUpGeoFences").setValue(['All']);
          } else {
            this.form.get('driverPickUpGeoFences').setValue(selectedPZones);
          }

          let selectedDZones = [];
          this.driver.driverDeliveryGeoFences.forEach(z => {
            const zone = this.fences.find(zone => zone.geoFenceId == z.geoFenceId);
            if (zone) {
              //zone.driverId = z.driverId;
              //zone.id = z.id;
              selectedDZones.push(zone);
            }
          });

          if (this.driver.allDeliveryGeoFences) {
            this.form.get("driverDeliveryGeoFences").setValue(['All']);
          } else {
            this.form.get('driverDeliveryGeoFences').setValue(selectedDZones);
          }
        }
      }
    });

  }

  /**
  * Fetch all agentType
  *
  *
  */
  getAgentType() {
    this.facadeService.agentTypeService.list().subscribe((result: AgentType[]) => {
      this.agentTypes = result;

      if (this.isEditMode) {
        this.form.patchValue({
          agentTypeId: this.driver.agentTypeId
        });
      }
      else {
        this.form.patchValue({
          agentTypeId: this.agentTypes[0].id
        });
      }

    });
  }

  /**
   *  create / update driver
   *
   *
   * @todo if you want to append image to form call imageBase64
   */
  async onSubmit() {
    this.isSubmitted = true;
    if (this.selectedTransportionType != 'walk' && this.selectedTransportionType != 'cycle' && this.selectedTransportionType != '') {

      const licensePlate = this.form.get('licensePlate').value;
      const color = this.form.get('color').value;

      if (color.trim() == '') {
        this.form.get('color').setValidators([Validators.required]);
        this.form.get('color').updateValueAndValidity();

      }

      if (licensePlate.trim() == '') {
        this.form.get('licensePlate').setValidators([Validators.required]);
        this.form.get('licensePlate').updateValueAndValidity();
      }

      this.form.markAllAsTouched();
    } else {
      this.form.get('licensePlate').clearValidators();
      this.form.get('color').clearValidators();

      this.form.get('licensePlate').updateValueAndValidity();
      this.form.get('color').updateValueAndValidity();
    }

    if (!this.form.valid) {
      this.isError = true;

      this.isSubmitted = false;
      return;
    } else {
      this.isError = false;
      this.errorMessage = '';
    }

    //if (this.validateNumberWithCode) {
    //  this.isSubmitted = false;
    //  this.numberMessage = '';
    //  return;
    //}

    let body = this.form.value;
    if (this.selectedCountry && this.selectedCountry.id) {
      const countryId = this.selectedCountry.id
      if (countryId) {
        body['countryId'] = countryId;
      }
    } else {
      this.isSubmitted = false;
      return this.snackBar.openSnackBar({
        message: this.translateService.instant(`Please Select Country Code`)
        , duration: 2500, action:
          this.translateService.instant(`OKay`)
      });
    }

    const transport = this.transportTypes.find(type => type.name.toLocaleLowerCase() == this.selectedTransportionType.toLocaleLowerCase());
    if (transport) {
      body['transportTypeId'] = transport.id;
    }

    //if (this.imageBase64 != '') {
    //  body['file'] = this.imageBase64;
    //}
    body['tags'] = this.tags.toString();

    let deliveryList = this.form.get('driverDeliveryGeoFences').value;
    if (deliveryList.findIndex(x => x == "All") > -1) {
      body['allDeliveryGeoFences'] = true;
      body['driverDeliveryGeoFences'] = [];
    } else if (deliveryList.length > 1) {
      const allIndex = deliveryList.findIndex(a => a == "All");
      if (allIndex >= 0) {
        deliveryList.splice(allIndex, 1);
      }
      body['driverDeliveryGeoFences'] = deliveryList;
    }

    let pickupList = this.form.get('driverPickUpGeoFences').value;
    if (pickupList.findIndex(x => x == "All") > -1) {
      body['allPickupGeoFences'] = true;
      body['driverPickUpGeoFences'] = [];
    } else if (pickupList.length > 1) {
      const allIndex = pickupList.findIndex(a => a == "All");
      if (allIndex >= 0) {
        pickupList.splice(allIndex, 1);
      }
      body['driverPickUpGeoFences'] = pickupList;
    }

    if (this.isEditMode) {
      body['id'] = this.driver.id;
      body['userId'] = this.driver.userId;
      body['imageUrl'] = this.driver.imageUrl;
      body['formFile'] = this.formFile;

      this.facadeService.driverService.update(body).subscribe(driver => {
        const message: Body = {
          message: this.translateService.instant('Driver has been updated successfully !'),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);
        this.isSubmitted = false;
        this.dialogRef.close({ data: driver });
      }, () => {
        this.isSubmitted = false;
        this.snackBar.openSnackBar({ message: "Fail to update driver", action: 'okay', duration: 2500 });
      });
    } else {

      if (this.formFile) {
        body['formFile'] = this.formFile;
      }

      this.facadeService.driverService.create(body).subscribe(driver => {
        const message: Body = {
          message: this.translateService.instant('Driver has been added successfully !'),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }
        this.dialogRef.close({ data: driver });
        this.isSubmitted = false;
        this.snackBar.openSnackBar(message);
      }, () => {
        this.isSubmitted = false;
      });
    }
  }

  /**
   * validate number with code using google-libphonenumber
   *
   *
   */
  validateNumberWithCode(): boolean {
    this.numberMessage = '';
    if (this.selectedCountry && this.selectedCountry.topLevel) {
      let number: string = this.form.value['phoneNumber'];
      const phoneNumber = ManageDriverComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
      const validNumber = ManageDriverComponent.phoneNumberUtil.isValidNumber(phoneNumber);

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

  /**
   * change transportaion type
   *
   *
   * @param event
   */
  onChangeType(event: MatButtonToggleChange) {
    this.selectedTransportionType = event.value;
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

  /**
   * remove tag from list
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
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * select image
   *
   *
   * @param event
   */
  onSelectImage(event) {
    let file = event.target.files[0];

    const type: string = file.type;
    if (type.indexOf('image')) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Only images extensions allowd'),
        action: this.translateService.instant('okay'),
        duration: 2500,
      });
    }

    if (file) {
      this.formFile = event.target.files[0];
      let reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }



  /**
   * image to base64
   *
   *
   * @param readerEvt
   */
  handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    this.dispalyImage = 'data:image/png;base64,' + btoa(binaryString);
  }


  /**
   * check if form input has an error
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'firstName':
        if (this.form.get('firstName').hasError('required')) {
          return this.translateService.instant(`First Name required`);
        }
        break;

      case 'lastName':
        if (this.form.get('lastName').hasError('required')) {
          return this.translateService.instant(`Last Name required`);
        }
        break;

      case 'username':
        if (this.form.get('username').hasError('required')) {
          return this.translateService.instant(`Username required`);
        }
        break;

      case 'password':
        if (this.form.get('password').hasError('required')) {
          return this.translateService.instant(`Password required`);
        }
        if (this.form.get('password').hasError('minlength')) {
          return this.translateService.instant(`Password must be at least 6 Characters`);
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

      case 'teamId':
        if (this.form.get('teamId').hasError('required')) {
          return this.translateService.instant(`Team required`);
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
      default:
        return '';
    }
  }

  /**
   * select country
   *
   *
   * @param counrty
   */
  onChangeCountry(counrty: Country) {
    this.selectedCountry = counrty;
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(() => {
        });
      }
    });
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

  validate(control: FormControl): { whitespace: boolean } {
    const valueNoWhiteSpace = control.value.trim();
    const isValid = valueNoWhiteSpace === control.value;
    return isValid ? null : { whitespace: true };
  }
}
