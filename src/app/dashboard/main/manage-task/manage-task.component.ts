import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ChangeDetectorRef, AfterViewChecked, OnDestroy, Type } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent, MatRadioChange, MatRadioButton } from '@angular/material';
import { FacadeService } from '@dms/app/services/facade.service';
import { MainTaskType } from '@dms/app/models/main/tasks/MainTaskType';
import { Customer } from '@dms/app/models/settings/customer';
import { Branch } from '@dms/app/models/settings/branch';
import { debounceTime } from 'rxjs/operators';
import { Country } from '@dms/models/settings/Country';
import { Types } from '@dms/constants/task-types';
import { Place } from '@dms/models/general/place';
import { Image } from '@dms/models/general/image';
import { Images } from '@dms/constants/images';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { AutomaticOrManualAssignComponent } from './../automatic-or-manual-assign/automatic-or-manual-assign.component';
import {
  AssignDriverMainTaskViewModel,
  CustomerViewModel,
  TasksViewModel,
  TaskSettingsViewModel
} from '@dms/models/task/assignDriverMainTaskViewModel';
import { AutoAllocation } from '@dms/models/settings/AutoAllocation';
import { SnackBar } from '@dms/app/utilities';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import { Address, AddressResult } from '@dms/models/settings/Address';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MainTask } from '../../../models/main/tasks/MainTask';
import { BarcodeComponent } from '../../../shared/barcode/barcode.component';
import { NgxPermissionsService } from 'ngx-permissions';

declare var $: any;

enum TYPE {
  PICKUP = 1,
  DELIVERY = 2
}

interface selectedBranch {
  index: number,
  branch: Branch,
}

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.scss'],
  providers: [
    DatePipe
  ]
})

export class ManageTaskComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  mainBody: any;
  private static readonly MAIN_TYPE: number = 1;
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();

  @Input() opend: boolean = false;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup;
  customers: Customer[] = [];
  branches: Branch[] = [];
  defaultBranch: Branch;
  mainTaskTypes: MainTaskType[] = [];
  imageBase64: string = '';
  dispalyImage = Images.add;
  pickupStep: number;
  deliveryStep: number;
  isPickupManaualLocation: boolean;
  isDeliveryManaualLocation: boolean;

  branchMode: boolean = false;

  places: Place[] = [];
  submitted: boolean;
  numberMessage: string;

  pickupImages: Image[] = [];
  deliveryImages: Image[] = [];

  pickupMarkers: MapMarker[] = [];
  deliveryMarkers: MapMarker[] = [];

  selectedImage: Image;
  selectedMarker: MapMarker;

  pickupNumberPhoneMessages: string[] = [];
  deliveryNumberPhoneMessages: string[] = [];

  previousPickupBranchIds: number[] = [];
  previousPickupCountryIds: number[] = [];
  previousDeliveryCountryIds: number[] = [];

  assignDriverMainTaskViewModel: AssignDriverMainTaskViewModel = {
    driverIds: [],
    mainTask: {
      mainTaskTypeId: ManageTaskComponent.MAIN_TYPE,
      tasks: [],
      settings: {
        driverIds: [],
        teamIds: [],
        tags: []
      }
    }
  };

  drivers: number[] = [];
  count: number = 0;
  tags: string[] = [];

  removable = true;

  settingEnableAutoAllocation: AutoAllocation = new AutoAllocation(0, '', '', '', 1);
  selectedPlace: Place;

  selectedPickupBefore: boolean = false;
  selectedDeliveryBefore: boolean = false;

  today = new Date();
  selectedBranches: selectedBranch[] = [];
  taskDateType: string;

  pickupsAddresses: Address[] = [];
  deliveriesAddresses: Address[] = [];

  pickups: FormArray;
  deliveries: FormArray;
  previousAddress: null;
  readBranch: boolean = false;

  /**
   *
   * @param fb
   * @param dialog
   * @param facadeService
   * @param snackBar
   * @param datePipe
   * @param translateService
   * @param cdr
   */
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private datePipe: DatePipe,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private mapMarkersService: MapMarkersService,
    private deviceDetectorService: DeviceDetectorService,
    private permissionsService: NgxPermissionsService) {
    this.form = this.fb.group({
      pickups: this.fb.array([]),
      deliveries: this.fb.array([]),
    });

    this.permissionsService.hasPermission('ReadBranch').then(readBranch => {
      this.readBranch = readBranch;
      this.branchMode = this.readBranch;
    });
  }

  async ngOnInit() {
    await this.getDefaultBranch();

    this.newPickup();
    this.newDelivery();

    this.getSettings();
    this.dispalyImage = Images.add;

    this.initDatePicker();
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  /**
   * default branch
   *
   *
   */
  async getDefaultBranch() {
    const defaultBranch = await this.facadeService.adminService.GetCurrentDefaultBranch().toPromise();

    if (defaultBranch) {
      this.defaultBranch = defaultBranch;
      this.branches = [];
      this.branches.push(this.defaultBranch);
    }
  }

  /**
   * datepicker
   *
   *
   */
  initDatePicker() {
    $(document).ready(() => {
      $('.datetimepicker').datetimepicker({
        onChangeDateTime: (dp: Date, inputs: any) => {

          const index: string = inputs[0].id;

          const type: string = inputs[0].dataset.type;
          this.taskDateType = type;

          const date = this.datePipe.transform(dp, 'medium');
          const indexForm = index.split('_')[1];

          if (type === 'pickup') {
            this.pickupsForm.controls[+indexForm].patchValue({ pickupDate: date });
          } else {
            this.deliveriesForm.controls[+indexForm].patchValue({ deliveryDate: date });
          }
        },
        validateOnBlur: false,
        minDate: new Date(),
        step: 15,
      });
    });
  }

  /**
   * search on customers
   *
   *
   */
  onSearchCustomers(event) {
    const keywords = event.target.value;
    if (keywords == '') {
      return;
    } else {
      this.facadeService.customerService.getCustomersByName(event.target.value).subscribe((result: any) => {
        this.customers = result;
      });
    }
  }

  /**
  * search on customers
  *
  *
  */
  onSearchCustomersByPhone(event) {
    const keywords = event.target.value;
    if (keywords == '') {
      return;
    } else {
      this.facadeService.customerService.getCustomersByPhone(event.target.value).pipe(debounceTime(500)).subscribe((result: any) => {
        this.customers = result;
      });
    }
  }

  /**
   * search on branches
   *
   *
   * @param event
   * @param index
   */
  onSearchBranches(event: any, index: number) {
    const keywords: string = event.target.value;
    if (keywords.trim() == '') {
      this.snackBar.openSnackBar({
        message: 'Enter keyword to search in branches!',
        duration: 2500,
        action: 'Okay'
      });

      return this.pickupsForm.controls[index].get('branchId').setValue(null);
    } else {
      this.facadeService.branchService.searchInBranches(event.target.value).pipe(debounceTime(1000)).subscribe((result: any) => {
        this.branches = result;

        if (this.branches.length == 0) {
          this.snackBar.openSnackBar({
            message: 'No branches found, add branches to search in',
            duration: 1000,
            action: 'Okay'
          });
          return this.pickupsForm.controls[index].get('branchId').setValue(null);
        }
      });
    }
  }

  /**
   * get parent form group
   *
   *
   *
   */
  get parentForm() {
    return this.form.controls;
  }

  /**
   * pickups forms array
   *
   *
   */
  get pickupsForm(): FormArray {
    return this.parentForm.pickups as FormArray;
  }

  /**
   * delivery forms array
   *
   *
   */
  get deliveriesForm(): FormArray {
    return this.parentForm.deliveries as FormArray;
  }

  /**
   * get pickup input
   *
   *
   * @param input
   * @param index
   */
  pickupInput(input: string, index: number): FormControl {
    return this.form.controls.pickups['controls'][index].get(input);
  }

  /**
   * get delivery input
   *
   *
   * @param input
   * @param index
   */
  deliveryInput(input: string, index: number): FormControl {
    return this.form.controls.deliveries['controls'][index].get(input);
  }

  /**
   * pickup forms count length
   *
   *
   */
  get pickupsLength() {
    return this.pickupsForm.length;
  }

  /**
   * delivery forms count length
   *
   *
   */
  get deliveriesLength() {
    return this.deliveriesForm.length;
  }

  /**
   * set step
   *
   *
   * @param index
   * @param type
   */
  setStep(index: number, type: string) {
    if (type == Types.pickup) {
      this.deliveryStep = index;
    } else {
      this.pickupStep = index;
    }
  }

  /**
   * close manage task form
   *
   *
   */
  closeManageTask(): void {
    this.close.emit(true);
  }

  /**
   * select image
   *
   *
   * @param event
   */
  onSelectImage(event, index: number, type: string) {

    const file = event.target.files[0];
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const isImage = file && acceptedImageTypes.includes(file['type']);

    if (!isImage) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Only images supported'),
        action: this.translateService.instant('okay'),
        duration: 2500
      });
    }

    if (file) {
      let reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

    this.selectedImage = {
      type: type,
      src: Images.add,
      file: file,
      index: index,
    };
  }

  /**
  * image to base64
  *
  *
  * @param readerEvt
  */
  handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    let imageBase64 = btoa(binaryString);

    if (this.selectedImage.type == Types.pickup) {
      const findIndex = this.pickupImages.findIndex(image => image.index == this.selectedImage.index && image.type == this.selectedImage.type);
      if (findIndex === -1) {
        this.pickupImages.push({ index: this.selectedImage.index, type: this.selectedImage.type, src: imageBase64, file: this.selectedImage.file });
      } else {
        this.pickupImages.splice(findIndex, 1);
        this.pickupImages.push({ index: this.selectedImage.index, type: this.selectedImage.type, src: imageBase64, file: this.selectedImage.file });
      }
    } else if (Types.delivery) {
      const findIndex = this.deliveryImages.findIndex(image => image.index == this.selectedImage.index && image.type == this.selectedImage.type);
      if (findIndex === -1) {
        this.deliveryImages.push({ index: this.selectedImage.index, type: this.selectedImage.type, src: imageBase64, file: this.selectedImage.file });
      } else {
        this.deliveryImages.splice(findIndex, 1);
        this.deliveryImages.push({ index: this.selectedImage.index, type: this.selectedImage.type, src: imageBase64, file: this.selectedImage.file });
      }
    }
  }

  /**
   * remove pickup / delivery location
   *
   *
   * @param index
   */
  removeLocation(index: number, type: string) {
    if (type == Types.pickup && (this.deliveriesForm.length >= 1 || this.pickupsForm.length > 1)) {
      this.removePickup(index);

      // remove related pickup image from pickup images list and code
      this.pickupImages.splice(index, 1);
      this.previousPickupCountryIds.splice(index, 1);
      this.pickupMarkers.splice(index, 1);
    } else if (type == Types.delivery && (this.deliveriesForm.length > 1 || this.pickupsForm.length >= 1)) {
      this.removeDelivery(index);

      // remove related pickup image from pickup images list and code
      this.deliveryImages.splice(index, 1);
      this.previousDeliveryCountryIds.splice(index, 1);
      this.deliveryMarkers.splice(index, 1);
    }

    const markers = [...this.pickupMarkers, ...this.deliveryMarkers];
    this.mapMarkersService.changeMarkers(markers, false);
  }

  /**
   * remove pickup form group
   *
   *
   * @param index
   */
  removePickup(index: number) {
    this.refreshMarkersList();
    this.pickups.removeAt(index);
  }

  /**
   * remove delivery form group
   *
   *
   * @param index
   */
  removeDelivery(index: number) {
    this.refreshMarkersList();
    this.deliveries.removeAt(index);
  }

  /**
   * new pickup
   *
   *
   */
  newPickup(): void {
    this.pickups = this.pickupsForm;
    this.pickupsForm.push(this.createPickup());
    const currentPickupIndex = this.pickupsForm.length - 1;

    this.toggleBranchAndCustomer(new MatRadioChange(null, "customer"), (currentPickupIndex));

    if (this.defaultBranch) {
      this.toggleBranchAndCustomer(new MatRadioChange(null, "branch"), (currentPickupIndex));
      this.selectBranch(this.defaultBranch, currentPickupIndex, 'pickup');
      this.form.controls.pickups['controls'][currentPickupIndex].get('branchId').setValue(this.defaultBranch);
    }

    const address: Address = {
      index: currentPickupIndex,
      opened: false,
      area: '',
      block: '',
      street: '',
      building: '',
      flat: '',
      floor: ''
    };

    this.pickupsAddresses.push(address);
  }

  /**
   * new delivery
   *
   *
   */
  newDelivery(): void {
    this.deliveries = this.deliveriesForm;
    this.deliveriesForm.push(this.createDelivery());

    const address: Address = {
      index: this.deliveriesForm.length - 1,
      opened: false,
      area: '',
      block: '',
      street: '',
      building: '',
      flat: '',
      floor: ''
    };

    this.deliveriesAddresses.push(address);
  }

  /**
   * create pickup form
   *
   *
   */
  createPickup(): FormGroup {
    return this.fb.group({
      phone: ['', Validators.compose([Validators.pattern("^[0-9]*$")])],
      email: [''],
      cid: ['', Validators.compose([Validators.pattern("^[0-9]*$"), Validators.minLength(12), Validators.maxLength(12)])],
      orderId: [''],
      description: [''],
      pickupDate: [this.addMintuesToDate('pickup'), [Validators.required]],
      address: ['', [Validators.required]],
      location: [null],
      customerId: ['', Validators.required],
      image: [''],
      taskTypeId: TYPE.PICKUP,
      longitude: [''],
      latitude: [''],
      branchId: [null],
    });
  }

  /**
   * Compares two Date objects
   *
   * @param date1
   * @param date2
   */
  compareDate(date1: Date, date2: Date): number {
    if (!date1) {
      return 0;
    }

    let newDateOne = new Date(date1);
    let newDateTwo = new Date(date2);
    let same = newDateOne.getTime() === newDateTwo.getTime();

    if (same) {
      return 0
    };

    if (newDateOne > newDateTwo) {
      return 1;
    }

    if (newDateOne < newDateTwo) {
      return -1;
    }
  }


  /**
   * create delivery form
   *
   *
   */
  createDelivery(): FormGroup {
    return this.fb.group({
      phone: ['', Validators.compose([Validators.pattern("^[0-9]*$"), Validators.required])],
      email: ['', Validators.email],
      cid: ['', Validators.compose([Validators.pattern("^[0-9]*$"), Validators.minLength(12), Validators.maxLength(12)])],
      orderId: [''],
      description: [''],
      deliveryDate: [this.addMintuesToDate('delivery'), Validators.required],
      address: ['', [Validators.required]],
      location: [null],
      customerId: ['', [Validators.required]],
      image: [''],
      taskTypeId: TYPE.DELIVERY,
      longitude: [''],
      latitude: [''],
      shippmentType: [''],
    });
  }

  /**
   * create task
   *
   *
   */
  async createTask() {
    this.submitted = true;

    if (!this.form.valid) {
      this.snackBar.openSnackBar({ message: this.translateService.instant(`Please fill the mandatory fields.`), action: this.translateService.instant('Okay'), duration: 2500 });
      this.pickupsForm.markAllAsTouched();
      this.deliveriesForm.markAllAsTouched();
      return;
    }

    this.fillTasksBody();

    if (!this.isValidatePickupDeliveryDate() && this.pickupsForm.length >= 1 && this.deliveriesForm.length >= 1) {
      this.snackBar.openSnackBar({ message: this.translateService.instant(`Delivery date must be greater than Pickup date.`), action: this.translateService.instant('Okay'), duration: 2500 });
      return this.submitted = false;
    };
    this.facadeService.mainTaskService.create(this.assignDriverMainTaskViewModel).subscribe(maintaskId => {
      this.close.emit(true);
      this.printDeliveriesBarCode(maintaskId);
    }, errors => {

      this.submitted = false;
      this.snackBar.openSnackBar({ message: this.translateService.instant('Server error'), action: this.translateService.instant('okay'), duration: 2500 });
    });
  }

  printDeliveriesBarCode(maintaskId: number) {
    this.facadeService.mainTaskService.getMainTask(maintaskId).subscribe((mainTask: MainTask) => {
      const deliveryTasks = mainTask.tasks.filter(task => task.taskTypeId == TYPE.DELIVERY);

      deliveryTasks.forEach(task => {
        let barcodes = [];
        barcodes.push({ name: mainTask.tasks[0].customer.name, code: task.id });
        const dialog = this.dialog.open(BarcodeComponent, {
          width: '95%',
          data: { barcodes },
          panelClass: 'custom-dialog-container',
          height: 'auto',
          minHeight: 'calc(75vh - 50px)'
        });

        dialog.disableClose = true;
        dialog.afterClosed().subscribe(res => {
        });
      });
    });
  }

  /**
   * validate Pickup Delivery Date
   *
   */
  isValidatePickupDeliveryDate(): boolean {
    let deliveryList = this.assignDriverMainTaskViewModel.mainTask.tasks.filter(a => a.taskTypeId == 2);
    let pickupList = this.assignDriverMainTaskViewModel.mainTask.tasks.filter(a => a.taskTypeId == 1);

    if (pickupList.length > 0) {
      const currentDate = new Date();
      const pickupDate = new Date(pickupList[0].pickupDate);
      if (pickupDate.getTime() < currentDate.getTime()) {
        this.snackBar.openSnackBar({ message: `Pickup date should be greater than current date ${currentDate}`, action: 'okay', duration: 2500 })
      }
    }

    if ((deliveryList.length > 0 && pickupList.length > 0) && this.compareDate(deliveryList[0].deliveryDate, pickupList[0].pickupDate) == 1) {
      return true;
    }

    return false;
  }

  /**
   * prepare task body form
   *
   *
   */
  fillTasksBody() {
    this.pickupsForm.value.map((element, index: number) => {
      if (this.pickupImages.length > 0) {
        //element.image = this.pickupImages[index]['src'];
        element.formImage = this.pickupImages[index]['file'];
      }

      if (!this.branchMode) {
        if (typeof element.customerId === 'string') {
          element.name = element.customerId;
        } else {
          element.name = element.customerId.name;
        }
      } else {
        element.name = element.branchId && element.branchId.name ? element.branchId.name : '';
      }

      element.taskTypeId = TYPE.PICKUP;
      element.countryId = this.previousPickupCountryIds[index];
    });


    this.deliveriesForm.value.map((element, index: number) => {
      if (this.deliveryImages.length > 0) {
        //element.image = this.deliveryImages[index]['src'];
        element.formImage = this.deliveryImages[index]['file'];
      }

      if (typeof element.customerId === 'string') {
        element.name = element.customerId;
      } else {
        element.name = element.customerId.name;
      }

      element.taskTypeId = TYPE.DELIVERY;
      element.countryId = this.previousDeliveryCountryIds[index];
    });

    let tasksArray = [];
    tasksArray.push(... this.pickupsForm.value, ...this.deliveriesForm.value);

    const tasks = tasksArray.map(task => {
      let customer: CustomerViewModel = {
        name: task.name,
        email: task.email,
        cid: task.cid,
        phone: task.phone,
        address: typeof (task.address) === 'object' ? task.address.formatted_address : task.address,
        latitude: !task.latitude || isNaN(task.latitude) ? null : task.latitude,
        longitude: !task.longitude || isNaN(task.longitude) ? null : task.longitude,
        tags: task.customerId && task.customerId.tags ? task.customerId.tags : '',
        countryId: task.countryId,
        location: task.location ? task.location : { area: '', block: '', building: '', flat: '', floor: '', street: '' },
      }

      const body: TasksViewModel = {
        customer: customer,
        taskTypeId: task.taskTypeId,
        orderId: task.orderId,
        address: typeof (task.address) === 'object' ? task.address.formatted_address : task.address,
        latitude: task.latitude,
        longitude: task.longitude,
        description: task.description,
        image: task.image,
        formImage: task.formImage,
        pickupDate: task.pickupDate ? new Date(task.pickupDate).toLocaleString() : '',
        deliveryDate: task.deliveryDate ? new Date(task.deliveryDate).toLocaleString() : '',
        location: task.location ? task.location : { area: '', block: '', building: '', flat: '', floor: '', street: '' },
        shippmentType: task.shippmentType
      }
      // branch
      if (this.branchMode) {

        if (task.branchId) {
          body.customer = task.branchId.customer;
          body.branchId = task.branchId.id;
          if (body.customer) {
            body.customerId = body.customer.id;
          }

          body.address = task.branchId.customer.address;
          body.latitude = task.branchId.customer.latitude;
          body.longitude = task.branchId.customer.longitude;
          body.description = task.description ? task.description : '';
        }
      }

      return body;
    });
    this.assignDriverMainTaskViewModel.mainTask.tasks = tasks;
  }

  /**
   * validate phone number
   *
   *
   */
  validPhones(): boolean {
    let pickupPhones = []
    pickupPhones = this.pickupsForm.value;

    for (let index = 0; index < pickupPhones.length; index++) {
      const task = pickupPhones[index];

      const phone = task.phone.toString();
      const code = task.customer.country.topLevel ? task.customer.country.topLevel : task.customerId.country.topLevel;

      if (!this.isNumberValid(phone, code)) {
        this.pickupNumberPhoneMessages[index] = this.translateService.instant(`Not valid number`);
      }
    }

    let deliveryPhones = []
    deliveryPhones = this.deliveriesForm.value;

    for (let index = 0; index < deliveryPhones.length; index++) {
      const task = deliveryPhones[index];

      const phone = task.phone.toString();
      const code = task.customer.country.topLevel ? task.customer.country.topLevel : task.customerId.country.topLevel;

      if (!this.isNumberValid(phone, code)) {
        this.pickupNumberPhoneMessages[index] = this.translateService.instant(`Not valid number`); this.translateService.instant(`Not valid number`);
      }
    }

    if ((this.pickupNumberPhoneMessages.length == 0) || (this.deliveryNumberPhoneMessages.length == 0)) {
      return true;
    }
  }

  /**
   * validate phone number
   *
   *
   * @param phone
   * @param code
   */
  isNumberValid(phone: string, code: string): boolean {
    const phoneNumber = ManageTaskComponent.phoneNumberUtil.parseAndKeepRawInput(phone, code);
    const validNumber = ManageTaskComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (validNumber) {
      return true;
    }
  }

  /**
   * fetch input
   *
   *
   * @param index
   */
  getInput(index: number, control: string): boolean {
    return this.form.controls['pickups']['controls'][index]['controls'][control]['invalid'];
  }

  /**
   * Fetch all mainTaskType
   *
   *
   */
  getMainTaskTypes() {
    this.facadeService.mainTaskTypeService.list().subscribe((result: MainTaskType[]) => {
      this.mainTaskTypes = result;


    });
  }


  /**
  * check if form input has an error
  *
  *
  * @param input
  */
  getPickupError(input: string, index: number) {
    switch (input) {
      case 'customerId':
        if (this.form.controls.pickups['controls'][index].get('customerId').hasError('required')) {
          return this.translateService.instant(`Name required`);
        }
        break;

      case 'phone':
        if (this.form.controls.pickups['controls'][index].get('phone').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;

      case 'pickupDate':

        if (this.form.controls.pickups['controls'][index].get('pickupDate').hasError('date')) {
          return this.translateService.instant(`Pickup Date must be greater than today date.`);
        }

        if (this.form.controls.pickups['controls'][index].get('pickupDate').hasError('required')) {
          return this.translateService.instant(`Pickup Date required`);
        }
        break;

      case 'address':
        if (this.form.controls.pickups['controls'][index].get('address').hasError('required')) {
          return this.translateService.instant(`Address required`);
        }
        break;

      case 'branchId':
        if (this.form.controls.pickups['controls'][index].get('branchId').hasError('required')) {
          return 'Branch required';
        }
        break;

      case 'email':
        if (this.form.controls.pickups['controls'][index].get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }

        if (this.form.controls.pickups['controls'][index].get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        break;
      case 'cid':
        if (this.form.controls.pickups['controls'][index].get('cid').status == "INVALID") {
          return this.translateService.instant(`CID must be  12 number`);
        }
        break;
    }
  }

  /**
  * check if form input has an error
  *
  *
  * @param input
  */
  getDeliveryError(input: string, index: number) {
    switch (input) {
      case 'phone':
        if (this.form.controls.deliveries['controls'][index].get('phone').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;

      case 'customerId':
        if (this.form.controls.deliveries['controls'][index].get('customerId').hasError('required')) {
          return this.translateService.instant(`Name required`);
        }
        break;

      case 'deliveryDate':
        if (this.form.controls.deliveries['controls'][index].get('deliveryDate').hasError('required')) {
          return this.translateService.instant(`Delivery Date must be greater than today date.`);
        }
        break;

      case 'address':
        if (this.form.controls.deliveries['controls'][index].get('address').hasError('required')) {
          return this.translateService.instant(`Address required`);
        }
        break;

      case 'email':
        if (this.form.controls.deliveries['controls'][index].get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }

        if (this.form.controls.deliveries['controls'][index].get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        break;
      case 'cid':
        if (this.form.controls.deliveries['controls'][index].get('cid').status == "INVALID") {
          return this.translateService.instant(`CID must be 12 number`);
        }
        break;
    }
  }

  /**
   * check if address empty or cleared
   *
   *
   * @param type
   * @param index
   */
  checkAddress(type: string, index: number) {
    if (type == 'pickup') {
      if (!this.selectedPickupBefore) {
        this.form.controls.pickups['controls'][index].get('address').setValue(null);
        this.selectedPlace = null;
      }
    } else {
      if (!this.selectedDeliveryBefore) {
        this.form.controls.deliveries['controls'][index].get('address').setValue(null);
        this.selectedPlace = null;
      }
    }
  }


  /**
   * search or manaual location
   *
   *
   * @param type
   */
  toggleManaulLocation(type: string) {
    if (type == Types.pickup) {
      this.isPickupManaualLocation = !this.isPickupManaualLocation;
    } else {
      this.isDeliveryManaualLocation = !this.isDeliveryManaualLocation;
    }
  }


  /**
   * select place
   *
   *
   * @param place
   * @param type
   */
  selectPlace(place: Place, type: string, index?: number) {
    this.selectedPlace = place;

    this.selectedMarker = {
      lat: place.lat,
      lng: place.lon,
      index: index,
      type: type,
      task: <any>{
        address: place.display_name
      }
    };

    switch (type) {
      case Types.pickup:
        this.pickupsForm.controls[index].patchValue({ latitude: place.lat, longitude: place.lon });
        break;

      case Types.delivery:
        this.deliveriesForm.controls[index].patchValue({ latitude: place.lat, longitude: place.lon });
        break;

      default:
        break;
    }

    this.refreshMarkersList()
  }

  // /**
  //  *
  //  * @param event
  //  * @param type
  //  * @param index
  //  */
  // addressClicked(event: any, type: string, index: number, address: string) {
  //   console.log("event", event);

  //   this.selectedPlace = {
  //     lat: event.latitude,
  //     lon: event.longitude,
  //   };

  //   this.selectedMarker = {
  //     lat: this.selectedPlace.lat,
  //     lng: this.selectedPlace.lon,
  //     index: index,
  //     type: type,
  //     task: <any>{
  //       address: address
  //     }
  //   };

  //   switch (type) {
  //     case Types.pickup:
  //       this.selectedPickupBefore = true;
  //       this.pickupsForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
  //       this.pickupsAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
  //       break;

  //     case Types.delivery:
  //       this.selectedDeliveryBefore = true;
  //       this.deliveriesForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
  //       this.deliveriesAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
  //       break;

  //     default:
  //       break;
  //   }

  //   this.refreshMarkersList();
  // }

  /**
   * display name
   *
   *
   * @param customer
   */
  displayFn(customer: Customer): string | undefined {
    return customer && customer.name ? customer.name : '';
  }


  /**
   * display name
   *
   *
   * @param customer
   */
  displayPhoneFn(customer: any): string | undefined {
    if (typeof customer === 'string') {
      return customer;
    }

    return customer && customer.phone ? customer.phone : '';
  }

  /**
   * display branch name
   *
   *
   * @param branch
   */
  displayBranchFn(branch: Branch): string | undefined {
    return branch && branch.name ? branch.name : '';
  }

  /**
   * select country
   *
   *
   * @param country
   */
  onChangeCountry(event: Country, index: number, type: string) {
    if (event && event.id) {
      switch (type) {
        case Types.pickup:
          this.previousPickupCountryIds[index] = event.id;
          break;

        case Types.delivery:
          this.previousDeliveryCountryIds[index] = event.id;
          break;
        default:
          break;
      }
    }
  }

  /**
   * select customer
   *
   *
   * @param event
   * @param index
   * @param type
   */
  customerSelected(event: MatAutocompleteSelectedEvent, index: number, type: string) {
    this.customers = [];
    const location = event.option.value.location;
    const customer: Customer = event.option.value;
    const body = {
      longitude: customer.longitude,
      latitude: customer.latitude,
      phone: customer.phone,
      email: customer.email,
      cid: customer.cid,
      name: customer.name,
    };

    this.selectedMarker = {
      lat: customer.latitude,
      lng: customer.latitude,
      type: type,
      index: index,
      task: <any>{
        address: customer.address
      }
    }
    this.refreshMarkersList();

    switch (type) {
      case Types.pickup:
        this.selectedPickupBefore = true;
        this.previousPickupCountryIds[index] = customer.country.id;

        this.pickupsForm.controls[index].patchValue(body);
        this.form.controls.pickups['controls'][index].get('phone').setValue(customer.phone);
        this.form.controls.pickups['controls'][index].get('address').setValue(customer.address);

        this.pickupsForm.controls[index].get('address').markAsDirty();
        this.pickupsForm.controls[index].get('address').updateValueAndValidity();

        this.selectPlace({ lat: +customer.latitude, lon: +customer.longitude }, Types.pickup, index);
        this.pickupsAddresses[index] = { ... { index: index, opened: this.pickupsAddresses[index].opened }, ...location };
        break;

      case Types.delivery:
        this.selectedDeliveryBefore = true;
        this.previousDeliveryCountryIds[index] = customer.country.id;

        this.form.controls.deliveries['controls'][index].get('phone').setValue(customer.phone);
        this.deliveriesForm.controls[index].patchValue(body);
        this.form.controls.deliveries['controls'][index].get('address').setValue(customer.address);

        this.deliveriesForm.controls[index].get('address').markAsDirty();
        this.deliveriesForm.controls[index].get('address').updateValueAndValidity();

        this.selectPlace({ lat: +customer.latitude, lon: +customer.longitude }, Types.delivery, index);
        this.deliveriesAddresses[index] = { ... { index: index, opened: this.deliveriesAddresses[index].opened }, ...location };
        break;
      default:
        break;
    }
  }

  /**
   * customer by phone search
   *
   *
   * @param event
   * @param index
   * @param type
   */
  customerSelectedPhone(event: MatAutocompleteSelectedEvent, index: number, type: string) {
    this.customers = [];
    const location = event.option.value.location;
    const customer: Customer = event.option.value;
    const body = {
      longitude: customer.longitude,
      latitude: customer.latitude,
      phone: customer.phone,
      email: customer.email,
      cid: customer.cid,
      name: customer.name,
    };

    this.selectedMarker = {
      lat: customer.longitude,
      lng: customer.longitude,
      type: type,
      task: <any>{
        address: customer.address
      }
    }
    this.refreshMarkersList();

    switch (type) {
      case Types.pickup:
        this.selectedPickupBefore = true;
        this.previousPickupCountryIds[index] = customer.country.id;
        this.pickupsForm.controls[index].patchValue(body);
        if (!this.branchMode) {
          this.form.controls.pickups['controls'][index].get('customerId').setValue(customer);
        }

        this.form.controls.pickups['controls'][index].get('address').setValue(customer.address);
        this.pickupsForm.controls[index].get('address').markAsDirty();
        this.pickupsForm.controls[index].get('address').updateValueAndValidity();
        this.selectPlace({ lat: +customer.latitude, lon: +customer.longitude }, Types.pickup, index);

        this.pickupsAddresses[index] = { ... { index: index, opened: this.pickupsAddresses[index].opened }, ...location };
        break;

      case Types.delivery:
        this.selectedDeliveryBefore = true;
        this.previousDeliveryCountryIds[index] = customer.country.id;
        this.deliveriesForm.controls[index].patchValue(body);
        this.form.controls.deliveries['controls'][index].get('customerId').setValue(customer);
        this.form.controls.deliveries['controls'][index].get('address').setValue(customer.address);
        this.deliveriesForm.controls[index].get('address').markAsDirty();
        this.deliveriesForm.controls[index].get('address').updateValueAndValidity();
        this.selectPlace({ lat: +customer.latitude, lon: +customer.longitude }, Types.delivery, index);

        this.deliveriesAddresses[index] = { ... { index: index, opened: this.deliveriesAddresses[index].opened }, ...location };
        break;
      default:
        break;
    }
  }

  /**
   * select branch
   *
   *
   * @param event
   */
  branchSelected(event: MatAutocompleteSelectedEvent, index: number, type: string) {
    this.branches = [];

    const branch: Branch = event.option.value;
    this.selectBranch(branch, index, type);
  }

  /**
   * branch selected
   *
   *
   * @param branch
   * @param index
   * @param type
   */
  selectBranch(branch: Branch, index: number, type: string) {
    this.selectedBranches.push({
      index: index,
      branch: branch
    });

    const body = {
      longitude: branch.longitude,
      latitude: branch.latitude,
      name: branch.name,
      address: branch.address
    };

    this.selectedMarker = {
      lat: +branch.latitude,
      lng: +branch.longitude,
      type: type,
      index: index,
      task: <any>{
        address: branch.address
      }
    }
    this.refreshMarkersList();

    switch (type) {
      case Types.pickup:
        this.selectedPickupBefore = true;
        this.pickupsForm.controls[index].patchValue(body);
        this.form.controls.pickups['controls'][index].get('address').setValue(branch.address);
        this.pickupsForm.controls[index].get('address').markAsDirty();
        this.pickupsForm.controls[index].get('address').updateValueAndValidity();
        this.selectPlace({ lat: +branch.latitude, lon: +branch.longitude }, Types.pickup, index);
        break;

      case Types.delivery:
        this.selectedDeliveryBefore = true;
        this.deliveriesForm.controls[index].patchValue(body);
        this.form.controls.deliveries['controls'][index].get('address').setValue(branch.address);
        this.deliveriesForm.controls[index].get('address').markAsDirty();
        this.deliveriesForm.controls[index].get('address').updateValueAndValidity();
        this.selectPlace({ lat: +branch.latitude, lon: +branch.longitude }, Types.delivery, index);
        break;
      default:
        break;
    }
  }

  /**
  * clear results
  *
  *
  * @param event
  */
  onSelectBranch(branch: Branch, index: number) {
    this.branches = [];

    const body = {
      id: branch.id,
      name: branch.name,
      address: branch.address,
    };

    this.previousPickupBranchIds[index] = branch.id;
    this.form.controls.pickups['controls'][index].patchValue(body);
  }

  /**
   *
   * @param index
   * @param type
   */
  getCodeValue(index: number, type: string) {
    if (type == Types.pickup) {
      return this.pickupInput('pickupDate', index).value;
    } else {
      return this.deliveryInput('pickupDate', index).value;
    }
  }

  /**
   * open assign driver dialog
   *
   *
   */
  assignDialog() {
    this.fillTasksBody();

    const dialogRef = this.dialog.open(AutomaticOrManualAssignComponent, {
      width: this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet() ? '100%' : '50%',
      height: '50%',
      position: { left: '0', bottom: '150px' },
      data: {
        editMode: false,
        mainTask: this.assignDriverMainTaskViewModel.mainTask,
        selectedDriversIds: this.assignDriverMainTaskViewModel.mainTask.settings.driverIds
      },
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result: TaskSettingsViewModel) => {
      if (result) {
        this.assignDriverMainTaskViewModel.mainTask.settings = result;
        this.count = this.assignDriverMainTaskViewModel.mainTask.settings.auto ? this.assignDriverMainTaskViewModel.mainTask.settings.driversCount : this.assignDriverMainTaskViewModel.mainTask.settings.driverIds.length;
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * remove tag
   *
   *
   * @param tag
   */
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  /**
  * push marker to list of delivery & pickup markers
  *
  *
  */
  refreshMarkersList() {
    if (this.selectedMarker && this.selectedMarker.type == Types.pickup) {
      const findIndex = this.pickupMarkers.findIndex(marker => marker.index == this.selectedMarker.index && this.selectedMarker.type == this.selectedMarker.type);
      if (findIndex === -1) {
        this.pickupMarkers.push({ index: this.selectedMarker.index, type: this.selectedMarker.type, lat: this.selectedMarker.lat, lng: this.selectedMarker.lng, task: this.selectedMarker.task });
      } else {
        this.pickupMarkers.splice(findIndex, 1);
        this.pickupMarkers.push({ index: this.selectedMarker.index, type: this.selectedMarker.type, lat: this.selectedMarker.lat, lng: this.selectedMarker.lng, task: this.selectedMarker.task });
      }
    } else if (this.selectedMarker && Types.delivery) {
      const findIndex = this.deliveryMarkers.findIndex(image => image.index == this.selectedMarker.index && image.type == this.selectedMarker.type);
      if (findIndex === -1) {
        this.deliveryMarkers.push({ index: this.selectedMarker.index, type: this.selectedMarker.type, lat: this.selectedMarker.lat, lng: this.selectedMarker.lng, task: this.selectedMarker.task });
      } else {
        this.deliveryMarkers.splice(findIndex, 1);
        this.deliveryMarkers.push({ index: this.selectedMarker.index, type: this.selectedMarker.type, lat: this.selectedMarker.lat, lng: this.selectedMarker.lng, task: this.selectedMarker.task });
      }
    }

    const markers = [...this.pickupMarkers, ...this.deliveryMarkers];
    this.mapMarkersService.changeMarkers(markers, false);
  }

  /**
   * auto alocation settings
   *
   *
   */
  getSettings() {
    this.facadeService.autoAllocationService.getSettingsByKey("IsEnableAutoAllocation").subscribe((result: AutoAllocation) => {
      this.settingEnableAutoAllocation = result;
      if (this.settingEnableAutoAllocation == undefined || this.settingEnableAutoAllocation == null) {
        ///no settings Selected by default will send unassign
      } else if (this.settingEnableAutoAllocation.value.toLowerCase() == "true") {
        this.assignDriverMainTaskViewModel.mainTask.settings.auto = true;
        this.assignDriverMainTaskViewModel.mainTask.settings.driversCount = 1;
        this.count = 1;
      } else {
        this.assignDriverMainTaskViewModel.mainTask.settings.auto = false;
      }
    });
  }

  /**
   * enforce to select address
   *
   *
   * @param option
   */
  getAddressOptionText(option) {
    if (option && option.display_name) {
      return option.display_name;
    } else if (typeof option === 'string') {
      return option;
    } else {
      return null;
    }



  }


  /**
   * create task with branch or customer
   *
   *
   * @param event
   */
  toggleBranchAndCustomer(event: MatRadioChange, index: number) {
    this.pickupsForm.controls[index].reset();
    const value = event.value;

    switch (value) {
      case 'branch':
        this.pickupsForm.controls[index].get('branchId').enable();
        this.pickupsForm.controls[index].get('branchId').setValidators([Validators.required]);
        this.pickupsForm.controls[index].get('orderId').setValidators([]);

        this.pickupsForm.controls[index].get('customerId').disable();
        this.pickupsForm.controls[index].get('email').disable();
        this.pickupsForm.controls[index].get('cid').disable();
        this.pickupsForm.controls[index].get('phone').disable();
        this.pickupsForm.controls[index].get('address').disable();
        this.pickupsForm.controls[index].get('longitude').disable();
        this.pickupsForm.controls[index].get('latitude').disable();

        this.pickupsForm.controls[index].updateValueAndValidity();
        this.pickupsForm.controls[index].get('pickupDate').setValue(this.addMintuesToDate('pickup'));

        if (this.readBranch) {
          this.branchMode = true;
        }
        break;

      default:
        this.pickupsForm.controls[index].get('customerId').enable();
        this.pickupsForm.controls[index].get('customerId').setValidators([Validators.required]);
        // this.pickupsForm.controls[index].get('orderId').setValidators([Validators.required]);
        this.pickupsForm.controls[index].get('orderId').setValidators([]);
        this.pickupsForm.controls[index].get('email').enable();
        this.pickupsForm.controls[index].get('cid').enable();

        //this.pickupsForm.controls[index].get('email').setValidators([Validators.required]);

        this.pickupsForm.controls[index].get('phone').enable();
        this.pickupsForm.controls[index].get('phone').setValidators([Validators.required]);

        this.pickupsForm.controls[index].get('address').enable();
        this.pickupsForm.controls[index].get('address').setValidators([Validators.required]);

        this.pickupsForm.controls[index].get('longitude').enable();
        this.pickupsForm.controls[index].get('longitude').setValidators([Validators.required]);

        this.pickupsForm.controls[index].get('latitude').enable();
        this.pickupsForm.controls[index].get('latitude').setValidators([Validators.required]);

        this.pickupsForm.controls[index].get('branchId').disable();
        this.pickupsForm.controls[index].updateValueAndValidity();
        this.pickupsForm.controls[index].get('pickupDate').setValue(this.addMintuesToDate('pickup'));
        this.branchMode = false;
        break;
    }
  }

  /**
   * check branch if exists at list
   *
   *
   * @param branch
   * @param index
   */
  checkBranchExistsInList(index: number) {
    if (this.selectedBranches.length == 0) {
      this.pickupsForm.controls[index].get('branchId').setValue(null);
    } else {
      const value = this.selectedBranches.filter(branch => {
        return branch.index == index;
      })[0];

      if (!value) {
        this.pickupsForm.controls[index].get('branchId').setValue(null);
      }
    }
  }

  /**
   *
   * @param type
   */
  addMintuesToDate(type: string) {
    let newDate = new Date();

    if (type == 'delivery') {
      newDate.setMinutes(newDate.getMinutes() + 15);
    } else {
      newDate.setMinutes(newDate.getMinutes() + 5);
    }

    return newDate.toLocaleString();
  }

  /**
   * hide / show address section
   *
   *
   * @param indexToFind
   * @param type
   */
  toggleAddressMap(indexToFind: number, type: string): void {
    switch (type) {
      case Types.pickup:
        let pickupAddress = this.pickupsAddresses[indexToFind];
        pickupAddress.opened = !pickupAddress.opened;
        break;

      case Types.delivery:
        let deliveryAddress = this.deliveriesAddresses[indexToFind];
        deliveryAddress.opened = !deliveryAddress.opened;
        break;
    }
  }

  /**
   * first location by address block
   *
   *
   * @param address
   * @param index
   * @param type
   */
  findLocation(address: Address, index: number, type: string): void {
    if (!address && (address['area'].trim() != '' && address['block'].trim() != '' || address['street'].trim() != '')) {
      return;
    }

    if (type == Types.pickup) {
      this.pickupInput('location', index).patchValue(address);
      this.pickupInput('address', index).patchValue(address['fullAddress']);
    } else {
      this.deliveryInput('location', index).patchValue(address);
      this.deliveryInput('address', index).patchValue(address['fullAddress']);
    }

    this.facadeService.addressService.getAddress(address).subscribe((addressObject: AddressResult) => {

      const lat = +addressObject.latitude;
      const lng = +addressObject.longtiude;

      this.selectedMarker = { lat, lng, index, type };

      this.refreshMarkersList();
      if (type == Types.pickup) {
        this.pickupInput('address', index).patchValue(addressObject.address);
        this.pickupsForm.controls[index].patchValue({ latitude: lat, longitude: lng });
      } else {
        this.deliveryInput('address', index).patchValue(addressObject.address);
        this.deliveriesForm.controls[index].patchValue({ latitude: lat, longitude: lng });
      }
    }, err => {
      this.snackBar.openSnackBar({ 'message': this.translateService.instant('Server error'), action: this.translateService.instant('okay'), duration: 2500 })
    });
  }

  removeImage(type: string, index: number): void {
    if (type == 'delivery') {
      this.deliveryImages.splice(index, 1);
    } else {
      this.pickupImages.splice(index, 1);
    }
  }

  /**
   * 
   * @param event 
   * @param type 
   * @param index 
   */
  onPlace(event: Place, type: string, index: number): void {
    this.selectedPlace = {
      lat: event.lat,
      lon: event.lon,
    };

    this.selectedMarker = {
      lat: this.selectedPlace.lat,
      lng: this.selectedPlace.lon,
      index: index,
      type: type,
      task: <any>{
        address: event.display_name
      }
    };

    switch (type) {
      case Types.pickup:
        this.selectedPickupBefore = true;
        this.pickupsForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
        this.pickupsAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
        break;

      case Types.delivery:
        this.selectedDeliveryBefore = true;
        this.deliveriesForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
        this.deliveriesAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
        break;

      default:
        break;
    }

    this.refreshMarkersList();
  }

  onMarker(event: Place, type: string, index: number): void {
    console.log('event', event);

    this.selectedPlace = {
      lat: event.lat,
      lon: event.lon,
    };

    let address: string = '';
    if (type == Types.pickup) {
      address = this.pickupInput('address', index).value;
    } else {
      address = this.deliveryInput('address', index).value;
    }

    this.selectedMarker = {
      lat: this.selectedPlace.lat,
      lng: this.selectedPlace.lon,
      index: index,
      type: type,
      task: <any>{
        address: event.display_name ? event.display_name : address,
      }
    };

    switch (type) {
      case Types.pickup:
        this.selectedPickupBefore = true;
        this.pickupsForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
        this.pickupsAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
        break;

      case Types.delivery:
        this.selectedDeliveryBefore = true;
        this.deliveriesForm.controls[index].patchValue({ latitude: this.selectedPlace.lat, longitude: this.selectedPlace.lon });
        this.deliveriesAddresses[index] = { index: index, opened: true, area: '', street: '', block: '', building: '' };
        break;

      default:
        break;
    }

    this.refreshMarkersList();
  }

  ngOnDestroy() {

  }
}
