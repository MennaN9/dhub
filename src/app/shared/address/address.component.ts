import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { FacadeService } from '@dms/app/services/facade.service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Address, AddressStreet, Option } from '@dms/models/settings/Address';
import { MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs/internal/Subscription';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  areas: Option[] = [];
  governorates: Option[] = [];
  blocks: Option[] = [];
  streets: Option[] = [];

  address: Address;
  locale: string;

  @Output() addressChanges: EventEmitter<Address> = new EventEmitter<Address>();
  @Output() validAddress: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('building', { static: true }) building: ElementRef;

  @Input() addressToReplace: Address;
  @Input() index: number = 0;
  @Input() isPACI: boolean = false;

  @Input() disableAddress: boolean = false;
  @Input() validateAddress: boolean = false;

  selectedArea: Option;
  selectedGovernorate: Option;
  selectedBlock: Option;
  subscriptions = new Subscription();

  /**
   * 
   * @param facadeService 
   */
  constructor(private facadeService: FacadeService) {
    this.subscriptions.add(this.facadeService.languageService.language.subscribe(lngCode => {
      this.locale = lngCode;
    }));
  }

  ngOnInit() {
    this.address = { governorate: '', area: '', block: '', building: '', flat: '', floor: '', street: '' };
    this.addressToReplace = { governorate: '', area: '', block: '', building: '', flat: '', floor: '', street: '' };

    if (!this.isPACI) {
      this.listAreas();
    } else {
      this.listGovernorates();
    }
  }

  ngAfterViewInit() {
    fromEvent(this.building.nativeElement, 'keyup').pipe(filter(Boolean), debounceTime(500), distinctUntilChanged(),
      tap(text => {
        if (this.checkString(this.address.area) && this.checkString(this.address.block) && this.checkString(this.address.street) && this.checkString(this.address.building)) {
          this.address.fullAddress = `${this.locale == 'en' ? 'block' : 'مربع'} ${this.address.block}, ${this.locale == 'en' ? 'building' : 'عمارة'} ${this.address.building} ${this.locale == 'en' ? 'street' : 'شارع'} ${this.address.street}, ${this.address.area}`;
          this.addressChanges.emit(this.address);
          this.validAddress.emit(true);
        }
      })).subscribe();
  }

  /**
   * check string length
   * 
   * 
   * @param string 
   */
  checkString(string: string): boolean {
    return string && string.trim().length > 0 ? true : false;
  }

  /**
   * areas
   * 
   * 
   */
  listAreas() {
    if (!this.addressToReplace) {
      this.blocks = [];
      this.streets = [];

      this.address.block = '';
      this.address.street = '';
    }

    this.subscriptions.add(this.facadeService.addressService.areas.subscribe((areas: Option[]) => {
      this.areas = areas;
    }));
  }

  listGovernorates() {
    this.subscriptions.add(this.facadeService.addressService.governorates.subscribe((governorates: Option[]) => {
      this.governorates = governorates;
    }));
  }

  /**
   * blocks via area
   * 
   * 
   */
  listBlocksByArea(area: string) {
    if (!this.addressToReplace) {
      this.streets = [];
      this.address.street = '';
    }

    this.subscriptions.add(this.facadeService.addressService.getBlocksByArea(area).subscribe((blocks: Option[]) => {
      this.blocks = blocks;
    }));
  }

  /**
   * areas via governorate
   * 
   * 
   */
  listAreasByGovernorate(governorate: string) {
    this.subscriptions.add(this.facadeService.addressService.areasByGovernorate(governorate).subscribe((areas: Option[]) => {
      this.areas = areas;
    }));
  }

  /**
   *  blocks via area / block / governate
   * 
   * 
   * @param addressStreet 
   */
  listStreets(addressStreet: AddressStreet) {
    this.subscriptions.add(this.facadeService.addressService.getStreetsByBlock(addressStreet).subscribe((streets: Option[]) => {
      this.streets = streets;
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.addressToReplace) {
      this.address = changes.addressToReplace.currentValue;

      if (this.isPACI && this.address && this.checkString(this.address.governorate)) {
        this.listAreasByGovernorate(this.address.governorate);
      }

      if (this.address && this.checkString(this.address.area)) {
        this.listBlocksByArea(this.address.area);
      }

      if (this.address && this.checkString(this.address.block)) {
        this.listStreets({ areaId: this.address.area, blockName: this.address.block });
      }
    }

    if (changes && changes.disableAddress) {
      this.disableAddress = changes.disableAddress.currentValue;
    }

    if (changes && changes.validateAddress) {
      this.validateAddress = changes.validateAddress.currentValue;
    }
  }

  /**
   * select area / block / street according to type
   * 
   * 
   * @param option 
   */
  onSelectOption(option: MatSelectChange, type: string): void {
    const value = option.value;
    if (type == 'governorate') {
      this.areas = [];
      this.blocks = [];
      this.streets = [];
      this.address.area = null;
      this.address.block = null;
      this.address.street = null;

      this.address.governorate = value;
      this.listAreasByGovernorate(value);
      this.addressChanges.emit(this.address);

    }

    if (type == 'area') {
      this.blocks = [];
      this.streets = [];
      this.address.block = null;
      this.address.street = null;

      this.address.area = value;

      this.listBlocksByArea(value);
      this.addressChanges.emit(this.address);

    }

    if (type == 'block') {
      this.streets = [];
      this.address.street = null;

      this.address.block = value;
      this.listStreets({ areaId: this.address.area, blockName: value });
      this.addressChanges.emit(this.address);

    }

    if (type == 'street') {
      this.address.street = value;
      if (this.checkString(this.address.area) && this.checkString(this.address.block) && this.checkString(this.address.street) && this.checkString(this.address.building)) {
        this.address.fullAddress = `${this.locale == 'en' ? 'block' : 'مربع'} ${this.address.block}, ${this.locale == 'en' ? 'building' : 'عمارة'} ${this.address.building} ${this.locale == 'en' ? 'street' : 'شارع'} ${this.address.street}, ${this.address.area}`;
        this.addressChanges.emit(this.address);
        this.validAddress.emit(true);
      }
    }
  }

  // /**
  //  * get area id
  //  * 
  //  * 
  //  * @param areaName 
  //  */
  // areaIdFromAreaName(areaName: string): number {
  //   this.tempAreas.forEach(area => {
  //     if (area.name.toLowerCase().includes(areaName.toLowerCase())) {
  //       this.selectedArea = area;
  //     }
  //   });

  //   return this.selectedArea.id;
  // }

  onChangePACI(paciNumber: number) {
    if (paciNumber.toString().trim().length > 0) {

      this.subscriptions.add(this.facadeService.addressService.getAddressViaPACI(paciNumber).subscribe((res: { location: Address, address: string }) => {
        const address = res.location;

        this.address.governorate = address.governorate;
        this.listAreasByGovernorate(address.governorate);

        this.address.area = address.area;
        this.listBlocksByArea(address.area);

        this.address.block = address.block;
        this.listStreets({ areaId: address.area, blockName: address.block });

        this.address.street = address.street;
        this.address.building = address.building;
        this.address.floor = address.floor;
        this.address.flat = address.flat;
        this.address.fullAddress = res.address;

        this.addressChanges.emit(this.address);
        this.validAddress.emit(true);
      }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
