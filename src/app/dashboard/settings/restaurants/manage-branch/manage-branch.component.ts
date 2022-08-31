import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacadeService } from '@dms/app/services/facade.service';
import { Place } from '@dms/app/models/general/place';
import { Manager } from '@dms/models/settings/Manager';
import { GeoFence } from '@dms/models/settings/GeoFence';
import { Country } from '@dms/app/models/settings/Country';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from '@dms/app/utilities';
import { MapsAPILoader } from '@agm/core';
import { Address, AddressResult } from '@dms/app/models/settings/Address';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-branch',
  templateUrl: './manage-branch.component.html',
  styleUrls: ['./manage-branch.component.scss']
})
export class ManageBranchComponent implements OnInit, AfterViewInit {

  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  isSubmitted: boolean = false;
  form: FormGroup;
  formTitle: string;
  formAction: string;
  places: Place[];

  managers: Manager[] = [];
  geoFences: GeoFence[] = [];

  showCoords: boolean = false;
  selectedCountry: Country;
  previousCountryId: number;
  numberMessage: string;
  restaurantId: number;
  previousAddress: string = '';
  private geoCoder: google.maps.Geocoder;
  showAddress: boolean = false;
  location: Address;
  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<ManageBranchComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private snackBar: SnackBar,
    private mapsAPILoader: MapsAPILoader
  ) {
    this.mapsAPILoader.load().then(() => {
      if (!this.geoCoder) {
        this.geoCoder = new google.maps.Geocoder();
      }
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      geoFenceId: ['', [Validators.required]],
      location: [null]
    });

    if (this.data.type == 'edit' && this.data.branch) {
      this.formAction = this.translateService.instant(`Update`);
      this.formTitle = this.translateService.instant(`Edit`);
      this.previousCountryId = this.data.branch.countryId;
      this.location = this.data.branch.location;
      this.showAddress = true;

      this.cdr.detectChanges();
    }
  }


  ngAfterViewInit() {
    if (this.data.type == 'edit' && this.data.branch) {
      this.formAction = this.translateService.instant('Update');
      this.formTitle = this.translateService.instant('Edit');

      this.form.patchValue(this.data.branch);
      this.previousCountryId = this.data.branch.countryId;
      this.previousAddress = this.data.branch.address;
    } else {
      this.formTitle = this.translateService.instant(`Add`);
      this.formAction = this.translateService.instant(`Create`);
    }

    this.getAllGeoFence();
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
      this.showCoords = true;
      this.isSubmitted = false;
      this.showAddress = true;
      return;
    }

    const type = this.data.type;
    let number: string = this.form.value['phone'];
    const phoneNumber = ManageBranchComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
    const validNumber = ManageBranchComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.isSubmitted = false;

      return this.numberMessage = this.translateService.instant(`Not valid number`);

    } else {
      this.numberMessage = '';
    }

    let form = this.form.value;
    form['address'] = typeof form['address'] === 'object' ? form['address'].formatted_address : form['address'];
    form['restaurantId'] = this.data.restaurantId;

    form['latitude'] = parseFloat(form['latitude']);
    form['longitude'] = parseFloat(form['longitude']);

    switch (type) {
      case 'add':
        form['countryId'] = this.selectedCountry.id;
        this.subscriptions.push(this.facadeService.branchService.create(form).subscribe(res => {
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        }));
        break;

      case 'edit':
        form['id'] = this.data.branch.id;
        form['isActive'] = this.data.branch.isActive;
        form['countryId'] = this.selectedCountry.id ? this.selectedCountry.id : this.previousCountryId;

        this.subscriptions.push(this.facadeService.branchService.update(form).subscribe(res => {
          //this.isSubmitted = false;
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        }));
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
      case 'phone':
        if (this.form.get('phone').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;
      case 'geoFenceId':
        if (this.form.get('geoFenceId').hasError('required')) {
          return this.translateService.instant(`Geo Fence required`);
        }
        break;
      case 'address':
        if (this.form.get('address').hasError('required')) {
          return this.translateService.instant(`Address required`);
        }
        break;
      case 'latitude':
        if (this.form.get('latitude').hasError('required')) {
          return this.translateService.instant(`Latitude required`);
        }
        break;

      case 'longitude':
        if (this.form.get('longitude').hasError('required')) {
          return this.translateService.instant(`Longitude required`);
        }
        break;
    }
  }

  /**
   * search places
   *
   *
   * @param event
   */
  // onKeyup(event) {
  //   let keywords = event.target.value;
  //   this.subscriptions.push(this.facadeService.mapsService.searchQuery(keywords).subscribe(places => {
  //     this.places = places;
  //   }));
  // }

  /**
   * get all GeoFence
   *
   *
   */
  getAllGeoFence() {
    this.subscriptions.push(this.facadeService.geoFenceService.list().subscribe(geoFences => {
      this.geoFences = geoFences;
    }));
  }

  /**
   * show / hide lat & lng
   *
   *
   */
  toggleManaulLocation() {
    return this.showCoords = !this.showCoords;
  }

  validatePhone() {
    let number: string = this.form.value['phone'];
    const phoneNumber = ManageBranchComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
    const validNumber = ManageBranchComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.isSubmitted = false;

      return this.numberMessage = this.translateService.instant(`Not valid number`);

    } else {
      this.numberMessage = '';
    }

  }

  /**
   * select country
   *
   *
   * @param country
   */
  onChangeCountry(country: Country) {
    this.selectedCountry = country;
  }

  /**
   * select place
   *
   *
   * @param place
   * set value
   *
   *
   * @param event
   */
  // onLocationSelected(event: any) {
  //   this.form.patchValue({ latitude: event.latitude, longitude: event.longitude });
  // }

  /**
   *
   * @param event
   */
  onChangeText(event: any) {
    const keywords: string = event.target.value;

    if (keywords.trim() == '') {
      this.form.get('address').setValue(null);
      this.form.get('latitude').setValue(null);
      this.form.get('longitude').setValue(null);
    }
  }

  /**
 * find location by address block
 * 
 * 
 * @param address 
 * @param index 
 * @param type 
 */
  findLocation(address: Address) {
    if (!address && (address['area'].trim() != '' && address['block'].trim() != '' || address['street'].trim() != '')) {
      return;
    }

    this.form.get('location').setValue(address);
    this.form.get('address').setValue(address.fullAddress);

    this.subscriptions.push(this.facadeService.addressService.getAddress(address).subscribe((addressObject: AddressResult) => {
      console.log(addressObject.address);

      this.form.get('latitude').setValue(addressObject.latitude);
      this.form.get('longitude').setValue(addressObject.longtiude);
      this.form.get('address').setValue(addressObject.address);
    }, err => {
      this.snackBar.openSnackBar({ 'message': this.translateService.instant('Server error'), action: this.translateService.instant('okay'), duration: 2500 })
    }));
  }

  toggleAddress(): boolean {
    return this.showAddress = !this.showAddress;
  }

  onPlace(place: Place) {
    if (place) {
      this.form.patchValue({
        address: place.display_name,
        latitude: place.lat,
        longitude: place.lon,
      });
    } 
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
