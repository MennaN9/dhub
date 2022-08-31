import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Option } from '@dms/app/services/settings/address.service';
import { BusinessRegistrationService, Type } from '@dms/app/services/tanent/business-registration.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TanentRegistration } from '@dms/models/tanent/TanentRegistration';
import { SnackBar } from '@dms/app/utilities/snakbar';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { Country } from '@dms/app/models/settings/Country';
import { MatDialogRef } from '@angular/material/dialog';
import { PhoneNumberUtil } from 'google-libphonenumber';

const BUSINESS_TYPE = 1;
const otherType = 8;
@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit, OnDestroy {
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  isLinear = true;
  previousCountryId: number;
  selectedCountry: Country;
  numberMessage: string = '';
  isSubmitted: boolean = false;
  firstFormGroup: FormGroup;
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

  validateBusinessAddress: boolean = false;
  validateOwnerAddress: boolean = false;
  showOwnerAddressWarring: boolean = false;
  otherBusinessType: boolean = false;
  driver: string = 'false';

  constructor(
    private fb: FormBuilder,
    private businessRegistrationService: BusinessRegistrationService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
    private router: Router,
    // public dialogRef: MatDialogRef<IndividualComponent>
  ) {
    this.firstFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      businessType: ['', [Validators.required]],
      ownerPhoneNumber: ['', [Validators.required]],
      socialMediaAccounts: this.fb.array([])
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

  onChangeServingZone(event: MatRadioChange) {
    this.servingZone = event.value;
  }
  onChangeDriver(event: MatRadioChange) {
    this.driver = event.value
  }
  validateFirstForm() {
    if (this.firstFormGroup.invalid) {
      this.validateBusinessAddress = true;
      return this.firstFormGroup.markAllAsTouched();
    }
  }
  onChangeCountry(country: Country) {
    this.selectedCountry = country;
  }
  validatePhone() {
    // validate number using google-libphonenumber
    let number: string = this.firstFormGroup.value['phoneNumber'];
    const phoneNumber = IndividualComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
    const validNumber = IndividualComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.numberMessage = this.translateService.instant(`Not valid number`);
      return;
    } else {
      this.numberMessage = '';
      this.isSubmitted = false;
    }
  }
  submit() {
    this.isSubmitted = true;

    if (!this.firstFormGroup.valid) {
      this.isSubmitted = false;
      return;
    }
    let body: TanentRegistration = { ... this.firstFormGroup.value };

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
    body.ownerName = '';
    body.countryId = this.selectedCountry.id;

    this.businessRegistrationService.create(body).subscribe(res => {
      this.snackBar.openSnackBar({
        message: this.translateService.instant('Thank you for registration, Administrator will review your request for approval'),
        action: this.translateService.instant('Ok'),
        duration: 2500
      });
      console.log(body)
      this.router.navigate([Routes.Login]);
    });
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
