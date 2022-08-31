import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacadeService } from '@dms/app/services/facade.service';
import { Admin } from '@dms/app/models/settings/profile/Admin';
import { DisplayIamge } from '@dms/app/enums/DisplayImage';
import { Country } from '@dms/app/models/settings/Country';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { SnackBar } from '@dms/app/utilities';
import { TranslateService } from '@ngx-translate/core';
import { App } from '@dms/app/core/app';

@Component({
  selector: 'app-basic-user-info',
  templateUrl: './basic-user-info.component.html',
  styleUrls: ['./basic-user-info.component.scss']
})
export class BasicUserInfoComponent implements OnInit, AfterViewInit {

  // Properties
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();

  selectedType: string;
  types: any = [
    {
      value: DisplayIamge.DriverImage,
      name: `DRIVER'S IMAGE`,
    },
    {
      value: DisplayIamge.CompanyImage,
      name: `Company's Logo`,
    }
  ];

  accept = 'image/*';
  form: FormGroup;
  currentUser: Admin;
  // Input for Country Code Component
  countryId: number = 0;
  country: Country;
  // Input for Country Name Component
  residentCountryId: number;
  numberMessage: string = '';
  @Input() basicData: Admin;

  bankLogoFile: File;
  imageBase64: string = '';
  imageToDisplay: string = 'assets/images/users/avatar.png';
  baseUrl: string = `${App.backEndUrl}/`;

  constructor(fb: FormBuilder,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.form = fb.group({
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      phone: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      companyName: [''],
      companyAddress: [''],
      id: [{ value: '', disabled: true }],
      bankLogoFile: [''],

      // agentText: [''],
      displayImage: [DisplayIamge.DriverImage]
    });
  }

  ngOnInit() {
    this.form.patchValue(this.basicData);
    this.countryId = this.basicData.countryId;
    if(this.basicData.bankLogoURL)
    this.imageToDisplay = this.baseUrl + this.basicData.bankLogoURL;

    this.GetCurrentCountry();
  }

  ngAfterViewInit() {
    this.residentCountryId = this.basicData.residentCountryId;
    this.cdr.detectChanges();
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
      this.bankLogoFile = event.target.files[0];
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
    this.imageToDisplay = 'data:image/png;base64,' + btoa(binaryString);
  }

  /**
   * To Get the Current Country Code and Use withgoogle-libphonenumber
   *
   *
   */
  GetCurrentCountry() {
    this.facadeService.countryService.getcountry(this.countryId).subscribe(res =>
      this.country = res)
  }

  /**
   *  Event handler for Button Sumbit
   *
   *
   */
  onSubmit() {
    this.numberMessage = '';

    if (this.form.invalid) {
      return;
    }

    // validate number using google-libphonenumber
    let number: string = this.form.value['phone'];
    const phoneNumber = BasicUserInfoComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.country.topLevel);
    const validNumber = BasicUserInfoComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      return this.numberMessage = this.translateService.instant('Not valid number');
    } else {
      this.numberMessage = '';

      let body = this.form.getRawValue();
      body.countryId = this.countryId;
      body.residentCountryId = this.residentCountryId;

      body.bankLogoFile = this.bankLogoFile;
      this.facadeService.adminService.UpdateUserInfo(body).subscribe(res => {
        if (res.succeeded == true) {
          this.facadeService.accountService.setUserName(body.firstName);
          this.snackBar.openSnackBar({ message: this.translateService.instant('Successfully updated'), action: this.translateService.instant('okay'), duration: 2500 });
        }
      });
    }
  }


  /**
   * Event Handler when Country Residency DropdownList Changes
   *
   *
   * @param country
   */
  onChangeResidentCountry(country: Country) {
    this.residentCountryId = country.id;
  }

  /**
   * Event Handler When Country DropDownlost changes
   *
   *
   * @param country
   */
  onChangeCountry(country: Country) {
    this.countryId = country.id;
    this.country = country;
  }

  /**
   * Return the Error Message to display
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'firstName':
        if (this.form.get('firstName').hasError('required')) {
          return this.translateService.instant('FullName required');
        }

        if (this.form.get('firstName').hasError('minlength')) {
          return this.translateService.instant('FullName Must be at least 4 Characters');
        }
        break;

      case 'email':
        if (this.form.get('email').hasError('required')) {
          return this.translateService.instant('Email required');
        } else if (this.form.get('email').hasError('email')) {
          return 'This is not a valid Email';
        }

        break;

      case 'phone':
        if (this.form.get('phone').hasError('required')) {
          return this.translateService.instant('Phone required');
        }
        else if (this.form.get('phone').hasError('minlength')) {
          return this.translateService.instant('Phone Must be at least 4 Numbers');
        }
        break;

      default:
        return '';
    }
  }
}
