import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as Leaflet from 'leaflet';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { Customer } from '@dms/app/models/settings/customer';
import { Country } from '@dms/app/models/settings/Country';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Images } from '@dms/app/constants/images';
import { TranslateService } from '@ngx-translate/core';
import { LatLng, MapsAPILoader } from '@agm/core';
import { Address, AddressResult } from '@dms/app/models/settings/Address';
import { Subscription } from 'rxjs';

const ZOOM = 6;
interface Place {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss'],
})
export class ManageCustomerComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  form: FormGroup;
  stateCtrl = new FormControl();

  countries: Country[] = [];
  tags: string[] = [];

  customer: Customer;
  country: Country;

  map: any;
  marker: Leaflet.Marker;

  lat: number = 29.378586;
  lng: number = 47.990341;

  numberMessage: string = '';

  phone: any;
  label: string;
  isSubmitted: boolean = false;
  panelOpenState: boolean = false;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  editMode: boolean;
  isManaualLocation: boolean = false;
  previousCountryId: number;

  places: Place[] = []
  selectedBefore: boolean = false;
  selectedPlace: Place;
  previousAddress: string = '';
  private geoCoder: google.maps.Geocoder;
  showAddress: boolean = false;
  subscriptions: Subscription[] = [];

  onMarkerMove: boolean = false;

  /**
   *
   * @param dialogRef
   * @param data
   * @param fb
   * @param facadeService
   * @param snackBar
   */
  constructor(
    public dialogRef: MatDialogRef<ManageCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
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
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      cid: ['', Validators.compose([Validators.pattern("^[0-9]*$"), Validators.minLength(12), Validators.maxLength(12)])],
      latitude: [''],
      longitude: [''],
      location: [null],
    });
  }

  /**
  * Fill form with customer data in edit mode.
  *
  *
  */
  fillFormData() {
    this.customer = this.data.customer;
    this.previousCountryId = this.customer.countryId;
    this.country = this.data.customer.country;
    this.previousAddress = this.customer.address;
    this.lat = this.customer.latitude;
    this.lng = this.customer.longitude;
    this.form.patchValue(this.customer);

    if (this.customer.latitude && this.customer.longitude) {
      this.initMap(this.customer.latitude, this.customer.longitude);
      this.addMarker(this.customer.latitude, this.customer.longitude);
    } else {
      this.initMap(this.lng, this.lng);
    }

    if (this.customer.tags != null) {
      this.tags = this.customer.tags.split(',');
    }

    this.lat = +this.customer.latitude;
    this.lng = +this.customer.longitude;
  }

  ngAfterViewInit() {
    if (this.data.type.toLocaleLowerCase() == 'edit') {
      this.label = this.translateService.instant('Update');
      this.editMode = true;
      this.selectedBefore = true;
      this.fillFormData();
    } else {
      this.label = this.translateService.instant('Add');
      this.editMode = false;
      this.initMap(this.lat, this.lng);
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  /**
   *  create / update customer
   *
   *
   */
  onSubmit() {
    this.isSubmitted = true;

    if (!this.form.valid) {
      this.isSubmitted = false;
      this.showAddress = true;
      return;
    }

    // validate number using google - libphonenumber
    let number: string = this.form.value['phone'];
    const phoneNumber = ManageCustomerComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.country.topLevel);
    const validNumber = ManageCustomerComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.isSubmitted = false;
      return this.numberMessage = this.translateService.instant(`'Not valid number'`);
    } else {
      this.numberMessage = '';
    }

    let body = this.form.value;
    if (this.tags.length > 0) {
      body['tags'] = this.tags.toString()
    }

    body['address'] = typeof body['address'] === 'object' ? body['address'].formatted_address : body['address'];
    const countryId = this.country.id
    if (countryId) {
      body['countryId'] = countryId;
    }

    for (let key in body) {
      if (!body[key]) {
        delete body[key];
      }
    }

    switch (this.editMode) {
      case true:
        body['id'] = this.customer.id;
        this.subscriptions.push(this.facadeService.customerService.update(body).subscribe((customer: Customer) => {
          const message: Body = {
            message: this.translateService.instant('Customer has been updated successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }

          this.snackBar.openSnackBar(message);
          this.isSubmitted = false;
          this.dialogRef.close({ data: customer, type: 'edit' });
        }, error => {
          this.isSubmitted = false;
        }));
        break;

      default:
        this.subscriptions.push(this.facadeService.customerService.create(body).subscribe((customer: Customer) => {
          const message: Body = {
            message: this.translateService.instant('Customer has been added successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }

          this.dialogRef.close({ data: customer });
          this.isSubmitted = false;
          this.snackBar.openSnackBar(message);
        }, error => {
          this.isSubmitted = false;
        }));
        break;
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
        this.snackBar.openSnackBar({ message: this.translateService.instant(`Tag exists before`), action: this.translateService.instant(`Okay`), duration: 2500 });
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
   * init map
   *
   *
   * @param lat
   * @param lng
   */
  private initMap(lat: number, lng: number): void {
    this.map = Leaflet.map('map', {
      center: [lat, lng],
      zoom: ZOOM,
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    tiles.addTo(this.map);
    this.map.setView([lng, lng], 5);

    //Read Marker in Edit Mode
    if (lat != null && lng != null) {
      this.form.patchValue({
        longitude: lng.toString(),
        latitude: lat.toString()
      });

      const newLatLng = new Leaflet.LatLng(lat, lng);
      this.map.panTo(newLatLng);
      this.marker = Leaflet.marker(newLatLng, {
        draggable: true,
        icon: Leaflet.icon({
          iconUrl: Images.customerLocation,
          iconSize: [60, 60],
          iconAnchor: [30 / 2, 35]
        })
      }).addTo(this.map);

      this.marker.on("drag", (e) => {
        this.onMarkerMove = true;
        this.isManaualLocation = true;

        const marker = e.target;
        const position: LatLng = marker.getLatLng();

        this.form.get('latitude').setValue(position.lat);
        this.form.get('longitude').setValue(position.lng);
      });

      this.map.setView([lat, lng], ZOOM);
    }
  }

  /**
   * Add marker & get coordinates
   *
   *
   *
   */
  onMapClick = (event) => {
    this.lat = event.latlng.lat;
    this.lng = event.latlng.lng;
    this.addMarker(+this.lat, +this.lng);
  }

  /**
   * toggle location
   *
   *
   */
  toggleManaulLocation() {
    this.isManaualLocation = !this.isManaualLocation;
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

      case 'address':
        if (this.form.get('address').hasError('required')) {
          return this.translateService.instant(`Address required`);
        }
        break;

      case 'email':
        if (this.form.get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }

        if (this.form.get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        break;
      case 'cid':
        if (!this.form.get('cid').valid) {
          return this.translateService.instant(`CID must be 12 number`);
        }
        break;


      case 'phone':
        if (this.form.get('phone').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;

      case 'tags':
        if (this.tags && this.tags.length == 0) {
          return this.translateService.instant(`Tags required`);
        }
        break;

      default:
        return '';
    }
  }

  /**
  *Select country
  *
  * @param country
  */
  onChangeCountry(country: Country) {
    this.country = country;
  }

  onPlace(place: Place) {
    if (place) {
      this.form.patchValue({
        address: place.display_name,
        latitude: place.lat,
        longitude: place.lon,
      });

      this.map.panTo(new Leaflet.LatLng(+place.lat, +place.lon));
      this.marker.setLatLng(new Leaflet.LatLng(+place.lat, +place.lon));
    } else {
      const message: Body = {
        message: this.translateService.instant('Address not found, You Can move marker to set your location'),
        action: this.translateService.instant('Okay'),
        duration: 2000,
      }

      this.snackBar.openSnackBar(message);
    }
  }

  /**
   * add marker to map
   *
   *
   * @param lat
   * @param lng
   */
  private addMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.map.panTo(new Leaflet.LatLng(lat, lng));
    this.marker = Leaflet.marker([lat, lng], {
      draggable: false,
      icon: Leaflet.icon({
        iconUrl: Images.customerLocation,
        iconSize: [60, 60],
        iconAnchor: [30 / 2, 35]
      })
    }).addTo(this.map);
    this.map.setView([lat, lng], 15);
    // set marker on map
    this.form.patchValue({
      latitude: lat.toFixed(3),
      longitude: lng.toFixed(3),
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

  /**
   * select address
   *
   *
   * @param event
   * @param type
   * @param index
   */
  // addressClicked(event: any) {
  //   this.selectedBefore = true;
  //   this.addMarker(+event.latitude, +event.longitude);
  //   this.form.patchValue({ latitude: event.latitude, longitude: event.longitude });
  // }

  /**
   * check if selected option before to get lat & lng
   *
   *
   */
  // checkAddress() {
  //   if (!this.selectedBefore) {
  //     this.form.get('address').setValue(null);
  //     this.selectedPlace = null;
  //   }
  // }

  /**
   *
   * @param event
   */
  onChangeText(event: any) {
    const keywords: string = event.target.value;
    if (keywords.trim() == '') {
      this.form.get('address').setValue(null);
      this.form.get('longitude').setValue(null);
      this.form.get('latitude').setValue(null);
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

    this.form.get('location').patchValue(address);
    this.subscriptions.push(this.facadeService.addressService.getAddress(address).subscribe((addressObject: AddressResult) => {
      this.lat = +addressObject.latitude;
      this.lng = +addressObject.longtiude;
      this.addMarker(+addressObject.latitude, +addressObject.longtiude);

      this.form.patchValue({ ...addressObject });
      this.form.get('address').setValue(address.fullAddress);
    }, err => {

      this.form.get('address').patchValue(address.fullAddress);
      this.snackBar.openSnackBar({ 'message': this.translateService.instant('Server error'), action: this.translateService.instant('okay'), duration: 2500 })
    }));
  }

  /**
   * hide / show address input
   * 
   * 
   */
  toggleAddress(): boolean {
    return this.showAddress = !this.showAddress;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
