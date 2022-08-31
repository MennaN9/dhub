import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { AddressService, Option } from '@dms/app/services/settings/address.service';
import { BusinessRegistrationService, Type } from '@dms/app/services/tanent/business-registration.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TanentRegistration } from '@dms/models/tanent/TanentRegistration';
import { SnackBar } from '@dms/app/utilities/snakbar';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { Address, AddressResult } from '@dms/models/settings/Address';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Country } from '@dms/app/models/settings/Country';
import { MatStepper } from '@angular/material';

const otherType = 8;
const BUSINESS_TYPE = 2;
@Component({
  selector: 'app-business-registration',
  templateUrl: './business-registration.component.html',
  styleUrls: ['./business-registration.component.scss']
})
export class BusinessRegistrationComponent implements OnInit, OnDestroy {
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  @ViewChild('stepper', { static: false }) stepper: MatStepper;

  isLinear = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  socialMediaAccounts: FormArray;
  types: Type[] = [];

  governorates: Option[] = [];
  subscriptions = new Subscription();

  hasMultiBranches: boolean = false;
  servingZone: string = 'no';
  sameAddress: boolean = false;

  areasFirstForm: Option[] = [];
  areasSecondForm: Option[] = [];
  urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  businessAddress: Address;
  ownerAddress: Address;

  validateBusinessAddress: boolean = false;
  validateOwnerAddress: boolean = false;
  showOwnerAddressWarring: boolean = false;
  otherBusinessType: boolean = false;
  validPhone: boolean = false;
  selectedCountry: Country;

  driver: string = 'false';
  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private businessRegistrationService: BusinessRegistrationService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
    private router: Router
  ) {
    this.firstFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      businessType: ['', [Validators.required]],
      // businessCID: ['', [Validators.required]],
      //otherBusinessType: [''],
      latitude: [0],
      longitude: [0],
      socialMediaAccounts: this.fb.array([])
    });

    this.secondFormGroup = this.fb.group({
      ownerName: ['', [Validators.required]],
      ownerCID: ['', [Validators.minLength(8)]],
      ownerPhoneNumber: ['', [Validators.required]],
      isSameBusinessAddress: [false],
    });

    this.thirdFormGroup = this.fb.group({
      hasOwnDrivers: [false, [Validators.required]],
      isDeliverToAllZones: [false],
      servingRadiusInKM: [null],
      numberOfDrivers:[1],
      numberOfOrdersByDriverPerOrder: [1],
    });

    this.addLink();
  }

  ngOnInit() {
    this.subscriptions.add(this.businessRegistrationService.getTypes().subscribe(types => {
      this.types = types;
    }));

  }

  createLink(): FormGroup {
    return this.fb.group({
      link: ['', [Validators.pattern(this.urlReg)]],
    });
  }

  addLink(): void {
    this.socialMediaAccounts = this.firstFormGroup.get('socialMediaAccounts') as FormArray;
    this.socialMediaAccounts.push(this.createLink());
  }

  onChangeMultipleBrnaches(event: MatRadioChange) {
    if (event.value == 'yes') {
      this.hasMultiBranches = true;
    } else {
      this.hasMultiBranches = false;
    }
  }

  onChangeServingZone(event: MatRadioChange) {
    this.servingZone = event.value;
  }
  onChangeDriver(event: MatRadioChange){
    this.driver= event.value
  }
  validateFirstForm() {
    if (this.firstFormGroup.invalid) {
      this.validateBusinessAddress = true;
      return this.firstFormGroup.markAllAsTouched();
    }
  }

  validateSecondForm() {
    if (this.secondFormGroup.invalid) {
      if (!this.sameAddress) {
        this.validateOwnerAddress = true;
        this.showOwnerAddressWarring = true;
      }

      return this.secondFormGroup.markAllAsTouched();
    }

    const number: string = this.secondFormGroup.get('ownerPhoneNumber').value;
    if(number){
      const phoneNumber = BusinessRegistrationComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
      const validNumber = BusinessRegistrationComponent.phoneNumberUtil.isValidNumber(phoneNumber);
      this.validPhone = validNumber;
    }

    if (!this.validPhone) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant(`Not valid number`),
        duration: 2500,
        action: 'Okay'
      });
    }

    if (this.secondFormGroup.valid && this.validPhone) {
      this.stepper.next();
    }
  }

  submit() {
    debugger;
    if (this.thirdFormGroup.invalid) {
      return this.thirdFormGroup.markAllAsTouched();
    }

    let body: TanentRegistration = { ... this.firstFormGroup.value, ... this.secondFormGroup.value, ... this.thirdFormGroup.value };

    // business address
    body.businessAddress = {
     paciNumber:this.businessAddress.paci,
      governorate: this.businessAddress.governorate,
      area: this.businessAddress.area,
      block: this.businessAddress.block,
      street: this.businessAddress.street,
      building: this.businessAddress.building,
      floor: this.businessAddress.floor,
      flat: this.businessAddress.flat,
    }

    // owner address
    if (!this.sameAddress) {
      body.ownerAddress = {
        paciNumber:this.ownerAddress.paci,
        governorate: this.ownerAddress.governorate,
        area: this.ownerAddress.area,
        block: this.ownerAddress.block,
        street: this.ownerAddress.street,
        building: this.ownerAddress.building,
        floor: this.ownerAddress.floor,
        flat: this.ownerAddress.flat,
      }
    }

    let arrayLinks: string[] = [];
    arrayLinks = body.socialMediaAccounts.map((value: any) => {
      return value.link;
    });

    body.socialMediaAccounts = [...arrayLinks].filter(link => link);

    if (this.servingZone == 'no') {
      body.isDeliverToAllZones = true;
    } else {
      body.isDeliverToAllZones = false;
    }

    body.registrationBusinessType = BUSINESS_TYPE;

    this.businessRegistrationService.create(body).subscribe(res => {
      this.snackBar.openSnackBar({
        message: this.translateService.instant('Thank you for registration, Administrator will review your request for approval'),
        action: this.translateService.instant('Ok'),
        duration: 2500
      });

      this.router.navigate([Routes.Login]);
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  removeLink(index: number) {
    this.socialMediaAccounts.removeAt(index);
  }

  /**
   * show error for input
   *
   *
   * @param form
   * @param input
   * @param msg
   */
  getError(form: FormGroup, input: string, msg: string): String {
    if (form.get(input) && form.get(input).hasError('required')) {
      return this.translateService.instant(msg);
    }

    if (form.get(input) && form.get(input).hasError('email')) {
      return this.translateService.instant(msg);
    }

    if (form.get(input) && form.get(input).hasError('pattern')) {
      return this.translateService.instant(msg);
    }

  }

  selectionChange(event: MatSelectChange, type: string) {
    if (type == "firstFormGroup") {
      this.addressService.areasByGovernorate(event.value).subscribe((res: any) => {
        this.areasFirstForm = res;
      });
    }

    if (type == "firstFormGroup") {
      this.addressService.areasByGovernorate(event.value).subscribe((res: any) => {
        this.areasSecondForm = res;
      });
    }
  }

  onChangeOwnerAddressCheckbox(event: MatCheckboxChange) {
    this.sameAddress = event.checked;

    if (this.sameAddress) {
      this.validateOwnerAddress = false;
      this.showOwnerAddressWarring = false;
    }
  }

  onAddressChanges(event: Address, type: string) {
    debugger;
    if (type == 'business') {
      this.businessAddress = event;
    } else {
      this.ownerAddress = event;
    }

    if ((this.businessAddress.governorate.trim() != '') && (this.businessAddress.area.trim() != '') && (this.businessAddress.block.trim() != '') &&
      (this.businessAddress.street.trim() != '') && (this.businessAddress.building.trim() != '')) {
      this.subscriptions.add(this.addressService.getAddress(this.businessAddress).subscribe((addressObject: AddressResult) => {
        this.firstFormGroup.patchValue({ latitude: +addressObject.latitude, longitude: +addressObject.longtiude });
      }));
    }
  }

  onValidAddress(event: boolean, type: string) {
    if (event && type == 'business') {
      this.validateBusinessAddress = false;
    } else {
      this.validateBusinessAddress = true;
    }

    if (event && type == 'owner') {
      this.validateOwnerAddress = false;
    } else {
      this.validateOwnerAddress = true;
    }
  }

  /**
   * when select type others show other type business input
   *
   * 8 is others
   *
   * @param event
   */
  onChangeType(event: MatSelectChange): void {
    if (event.value === otherType) {
      this.otherBusinessType = true;
      this.firstFormGroup.get('otherBusinessType').setValidators([Validators.required]);
      this.firstFormGroup.markAllAsTouched();
    } else {
      this.otherBusinessType = false;
      this.firstFormGroup.get('otherBusinessType').clearValidators();
    }
  }

  onChangeCountry(country: Country) {
    this.selectedCountry = country;
  }
}
