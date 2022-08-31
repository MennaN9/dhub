import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { App } from '@dms/app/core/app';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { Task } from '@dms/app/models/main/tasks/Task';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Images } from '@dms/app/constants/images';
import { debounceTime } from 'rxjs/operators';
import { Customer } from '@dms/app/models/settings/Customer';
import { Country } from '@dms/app/models/settings/Country';
import { AutomaticOrManualAssignComponent } from '../automatic-or-manual-assign/automatic-or-manual-assign.component';
import { MainTaskType } from '@dms/app/models/main/tasks/MainTaskType';
import { Place } from '@dms/models/general/place';
import { PhoneNumberUtil } from 'google-libphonenumber';
declare var $: any;
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Branch } from '@dms/app/models/settings/branch';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { TaskStatus } from '@dms/models/main/tasks/TaskStatus';
import { AutoAllocation } from '@dms/app/models/settings/AutoAllocation';
import { TaskStatus as statusTypes } from '@dms/app/constants/task-status-types';

interface Type {
  value: number,
  viewValue: string,
}

enum Types {
  PICKUP_DELIVERY = 1,
}

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
  providers: [
    DatePipe
  ]
})
export class EditTaskComponent implements OnInit, AfterViewInit {
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  private static readonly pickupType = 1;

  @Output() close = new EventEmitter<boolean>();
  @Output() markers: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  accept = 'image/*';
  imageURL = App.taskImagesUrl;
  formImage: File;
  image: string = Images.add;
  taskStatus: TaskStatus[] = [];
  places: Place[] = [];
  numberMessage: string = '';
  step: number;
  types: Type[] = [];
  selectedType: number;
  submitted: boolean = false;
  type: string = this.translateService.instant(`Pickup`);
  isManaualLocation: boolean = false;

  customers: Customer[];
  branches: Branch[] = [];

  previousCountryId: number;
  numberPhoneMessage: string = '';

  drivers: number;
  count: number;
  tags: string[];
  country: Country;
  mainTaskTypes: MainTaskType[] = [];
  task: Task;
  taskID;
  branchMode: boolean = false;
  selectedBefore: boolean = false;
  selectedPlace: Place;
  settingEnableAutoAllocation: AutoAllocation = new AutoAllocation(0, '', '', '', 1);
  previousAddress: string = '';

  constructor(
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {
    this.form = fb.group({
      customerName: ['', [Validators.required]],
      phone: ['', Validators.compose([Validators.pattern("^[0-9]*$")])],
      email: ['', [Validators.email]],
      cid: ['', [Validators.max(999999999999)]],
      orderId: [''],
      description: [''],
      date: ['', Validators.required],
      address: ['', [Validators.required]],
      longitude: [''],
      latitude: [''],
      status: [''],
      customer: [''],
      branchId: [null]
    });

    // find task
    this.task = this.data.task.tasks.find(task => {
      return task.id == this.data.selectedIndex;
    });

    this.taskID = this.task.id;
    this.changeTaskData(this.task.id);

    // drivers count
    if (this.task.taskStatusId == statusTypes.Unassigned) {
      this.count = 0;
    } else {
      this.count = 1;
    }
  }

  isTaskWithBranch: boolean = false;

  ngOnInit() {
    this.getMainTaskTypes();
    this.getTaskStatus();

    this.selectedType = Types.PICKUP_DELIVERY;
    this.form.patchValue(this.task);
    this.taskID = this.task.id;
    this.image = this.task.image ? this.imageURL + this.task.image : this.image;

    this.form.get('customer').setValue(this.task.customer);
    this.form.get('customerName').setValue(this.task.customer.name);
    this.form.get('phone').setValue(this.task.customer.phone);
    this.form.get('email').setValue(this.task.customer.email);
    this.form.get('cid').setValue(this.task.customer.cid);

    this.form.get('address').setValue(this.task.customer.address);
    this.previousAddress = this.task.customer.address;

    if (this.task.taskTypeId == 1) {
      this.form.get('date').setValue(this.task.pickupDate);
    }
    else {
      this.form.get('date').setValue(this.task.deliveryDate);
    }

    if (this.task.branchId && this.task.taskTypeId == 1) {
      this.isTaskWithBranch = true;
      this.form.get('branchId').setValidators([Validators.required]);
      this.form.get('customerName').disable();
      this.form.get('email').disable();
      this.form.get('cid').disable();

      this.form.get('phone').disable();
      this.form.get('address').disable();
      this.form.get('orderId').setValidators([Validators.required]);

      this.form.updateValueAndValidity();
      this.branchMode = true;
    }

    this.selectedBefore = true;
  }

  ngAfterViewInit() {
    this.initDatePicker();
    this.previousCountryId = this.task.customer.countryId;
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

          const date = this.datePipe.transform(dp, 'medium');
          this.form.patchValue({ date: date });
        },
        validateOnBlur: false,
        step: 15
      });
    });
  }


  /**
   * close edit task
   *
   */
  closeEditTask() {
    this.dialogRef.close();
  }

  /**
  *  update task
  *
  */
  updateTask() {

    this.submitted = true;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    let body: Task;
    body = this.task;

    // which date type
    if (this.task.taskTypeId == 1) {
      body.pickupDate = this.form.get('date').value;
    } else {
      body.deliveryDate = this.form.get('date').value;
    }

    body['formImage'] = this.formImage;

    const formValue = this.form.value;
    body.description = formValue.description;

    if (!this.branchMode) {
      body['customer']['name'] = formValue.customerName;
      body['customer']['cid'] = formValue.cid;

      if (typeof formValue.address == 'string') {
        body['customer']['address'] = formValue.address;
      }
      else {
        body['customer']['address'] = formValue.address.formatted_address;
        body['customer']['latitude'] = formValue.latitude;
        body['customer']['longitude'] = formValue.longitude;
        body['latitude'] = formValue.latitude;
        body['longitude'] = formValue.longitude;
        body['address'] = formValue.address.formatted_address;
      }
    }
    else {
      body['customer']['address'] = this.task.customer.address;
      body['customer']['latitude'] = this.task.customer.latitude;
      body['customer']['longitude'] = this.task.customer.longitude;
      body['latitude'] = this.task.latitude;
      body['longitude'] = this.task.longitude;
      body['address'] = this.task.address;
    }

    body['taskStatusId'] = this.task.taskStatusId;
    body.orderId = formValue.orderId;
    body.driverId = this.drivers ? this.drivers : this.task.driverId;

    // select driver at least
    //if (!body.driverId) {
    //  this.snackBar.openSnackBar({ message: this.translateService.instant(`Please select a driver.`), action: this.translateService.instant('Okay'), duration: 2500 });
    //  return this.submitted = false;
    //}

    this.facadeService.taskService.update(body).subscribe((result) => {

      const message: Body = {
        message: this.translateService.instant(`Success task has been Updated !`),
        action: this.translateService.instant(`Okay`),
        duration: 2000
      }
      this.snackBar.openSnackBar(message);
      this.dialogRef.close();
    });
  }

  /**
   * select image
   *
   *
   * @param event
   */
  onSelectImage(event: any) {
    const file = event.target.files[0];
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const isImage = file && acceptedImageTypes.includes(file['type']);

    if (!isImage) {
      return this.snackBar.openSnackBar({
        message: this.translateService.instant('Only images supported'),
        action: this.translateService.instant('Okay'),
        duration: 2500
      });
    }

    if (file) {
      this.formImage = file;
      let reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(readerEvt: any): void {
    let binaryString = readerEvt.target.result;
    this.image = 'data:image/png;base64,' + btoa(binaryString)
  }

  /**
  * check if form input has an error
  *
  *
  * @param input
  */
  getError(input: string) {
    switch (input) {
      case 'phone':
        if (this.form.get('phone').hasError('required')) {
          return this.translateService.instant(`phone required`);
        }
        break;

      case 'customerName':
        if (this.form.get('customerName').hasError('required')) {
          return this.translateService.instant(`Name required`);
        }
        break;

      case 'date':
        if (this.form.get('date').hasError('required')) {
          return this.translateService.instant(`Date required`);
        }
        break;

      case 'address':
        if (this.form.get('address').hasError('required')) {
          return this.translateService.instant(`Address required`);
        }
        break;

      case 'branchId':
        if (this.form.get('branchId').hasError('required')) {
          return 'Branch required';
        }
        break;

      case 'email':
        if (this.form.get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }
        break;
      case 'cid':
        if (this.form.get('cid').hasError('max')) {
          return this.translateService.instant(`CID max length is 12 number`);
        }
        break;
    }
  }

  /**
   * search or manaual location
   *
   *
   */
  toggleManaulLocation() {
    this.isManaualLocation = !this.isManaualLocation;
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
      this.facadeService.customerService.getCustomersByName(event.target.value)
        .pipe(debounceTime(1000))
        .subscribe((result: any) => {
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
      this.facadeService.customerService.getCustomersByPhone(event.target.value)
        .pipe(debounceTime(1000))
        .subscribe((result: any) => {
          this.customers = result;
        });
    }
  }



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
   * select country
   *
   *
   * @param country
   */
  onChangeCountry(event: Country) {
    this.previousCountryId = event.id;
  }

  /**
   * open assign driver dialog
   *
   *
   */
  assignDialog() {
    const dialogRef = this.dialog.open(AutomaticOrManualAssignComponent, {
      width: '50%',
      height: 'auto',
      data: {
        editMode: true,
        driverId: this.task.driverId ? this.task.driverId : null,
      },
      position: { left: '0', bottom: '10%' },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.drivers = result.driverIds[0];
        this.count = result.driversCount;
        this.tags = result.tags;
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * fetch all mainTaskType
   *
   */
  getMainTaskTypes() {
    this.facadeService.mainTaskTypeService.list().subscribe((result: MainTaskType[]) => {
      this.mainTaskTypes = result;
    });
  }

  /**
   * fetch all task status and set default selected task status
   *
   *
   */
  getTaskStatus() {
    this.facadeService.taskStatusService.list().subscribe((result: TaskStatus[]) => {
      this.taskStatus = result;
      const id = this.task.taskStatusId;
      const toSelect = this.taskStatus.find(status => status.id == id);

      this.form.get('status').setValue(toSelect);
    });
  }


  /**
  * push marker to list of delivery & pickup markers
  *
  *
  * @param readerEvt
  */
  refreshMarkersList() {
    this.markers.emit({ pickupMarkers: [], deliveryMarkers: [] });
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
   * on search address
   *
   *
   * @param event
   */
  onKeyup(event: any) {
    this.places = [];

    this.facadeService.mapsService.searchQuery(event.target.value).subscribe(places => {
      this.places = places;
    });
  }

  /**
   * clear results
   *
   *
   * @param event
   */
  onSelectCustomer(customer: Customer) {
    this.customers = [];

    const body = {
      longitude: customer.longitude,
      latitude: customer.latitude,
      phone: customer.phone,
      email: customer.email,
      cid: customer.cid,
      address: customer.address,
      name: customer.name,
    };

    this.previousCountryId = customer.country.id;
    this.form.patchValue(body);
    this.addressClicked({ lat: +customer.latitude, lon: +customer.longitude });
  }

  /**
   * Edit task with branch or customer
   *
   *
   * @param event
   */
  checkWichTypeToDisplay(type: string) {
    switch (type) {
      case 'branch':
        this.form.get('branchId').setValidators([Validators.required]);
        this.form.get('customerId').disable();
        this.form.get('email').disable();
        this.form.get('cid').disable();
        this.form.get('phone').disable();
        this.form.updateValueAndValidity();
        this.branchMode = true;
        break;

      case 'customer':
        this.form.get('customerId').setValidators([Validators.required]);
        this.form.get('email').setValidators([Validators.required]);
        this.form.get('cid').setValidators([Validators.max(999999999999)]);
        this.form.get('phone').setValidators([Validators.required]);
        this.form.get('branchId').disable();
        this.form.updateValueAndValidity();
        this.branchMode = false;
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
    const body = {
      longitude: branch.longitude,
      latitude: branch.latitude,
      name: branch.name,
      address: branch.address
    };

    switch (type) {
      case 'pickup':
        this.form.patchValue(body);
        this.form.controls.pickups['controls'][index].get('address').setValue(branch.address);

        this.form.get('address').markAsDirty();
        this.form.get('address').updateValueAndValidity();

        this.addressClicked({ lat: +branch.latitude, lon: +branch.longitude });
        break;

      case 'delivery':
        this.form.patchValue(body);
        this.form.controls.deliveries['controls'][index].get('address').setValue(branch.address);

        this.form.get('address').markAsDirty();
        this.form.get('address').updateValueAndValidity();

        this.addressClicked({ lat: +branch.latitude, lon: +branch.longitude });
        break;
      default:
        break;
    }
  }

  /**
   * search on branches
   *
   *
   */
  onSearchBranches(event: any) {
    const keywords = event.target.value;
    if (keywords == '') {
      return;
    } else {
      this.facadeService.branchService.searchInBranches(event.target.value).pipe(debounceTime(1000)).subscribe((result: any) => {
        this.branches = result;
      });
    }
  }

  /**
   *
   * @param event
   * @param type
   * @param index
   */
  addressClicked(event: any) {
    this.selectedPlace = {
      lat: +event.latitude,
      lon: +event.longitude,
    };

    this.selectedBefore = true;
    this.form.patchValue({ latitude: event.latitude, longitude: event.longitude });
  }

  // /**
  //  * check if address empty or cleared
  //  *
  //  *
  //  * @param type
  //  * @param index
  //  */
  // checkAddress() {
  //   if (!this.selectedBefore) {
  //     this.form.get('address').setValue(null);
  //     this.selectedPlace = null;
  //   }
  // }

  /**
   * add marker
   *
   *
   */
  addMarker() {
    const type = this.task.taskTypeId;
    if (type == 1) {
      this.markers.emit({ pickupMarkers: [{ index: 0, type: 1, lat: this.selectedPlace.lat, lng: this.selectedPlace.lon }], deliveryMarkers: [] });
    } else {
      this.markers.emit({ pickupMarkers: [], deliveryMarkers: [{ index: 0, type: 2, lat: this.selectedPlace.lat, lng: this.selectedPlace.lon }] });
    }
  }

  /**
   * set task data
   *
   *
   * @param taskId
   */
  changeTaskData(taskId: number) {
    if (this.data.taskTypeId == EditTaskComponent.pickupType) {
      this.type = this.translateService.instant(`Pickup`);
    } else {
      this.type = this.translateService.instant(`Delivery`);
    }

    // fetch task
    const task = this.data.task.tasks.find(task => task.id == taskId);
    this.task = task;
    this.taskID = this.task.id;


    this.form.get('customer').setValue(this.task.customer);
    this.form.get('customerName').setValue(this.task.customer.name);
    this.form.get('phone').setValue(this.task.customer.phone);
    this.form.get('email').setValue(this.task.customer.email);
    this.form.get('cid').setValue(this.task.customer.cid);
    this.form.get('address').setValue(this.task.customer.address);

    if (this.task.taskTypeId == 1) {
      this.form.get('date').setValue(this.task.pickupDate);
    }
    else {
      this.form.get('date').setValue(this.task.deliveryDate);
    }


    this.form.patchValue(this.task);

    this.form.get('customer').setValue(this.task.customer);
    this.form.get('customerName').setValue(this.task.customer.name);
    this.form.get('phone').setValue(this.task.customer.phone);
    this.form.get('email').setValue(this.task.customer.email);
    this.form.get('cid').setValue(this.task.customer.cid);

    this.form.get('address').setValue(this.task.customer.address);


    if (this.task.branchId && this.task.taskTypeId == 1) {
      this.isTaskWithBranch = true;
      this.form.get('branchId').setValidators([Validators.required]);
      this.form.get('customerName').disable();
      this.form.get('email').disable();
      this.form.get('cid').disable();
      this.form.get('phone').disable();
      this.form.get('address').disable();
      this.form.get('orderId').setValidators([Validators.required]);

      this.form.updateValueAndValidity();
      this.branchMode = true;
    }
    else {
      this.branchMode = false;
      this.form.get('branchId').setValidators([]);
      this.form.get('customerName').enable();
      this.form.get('email').enable();
      this.form.get('cid').enable();

      this.form.get('phone').enable();
      this.form.get('address').enable();
      this.form.get('orderId').setValidators([]);
      this.form.get('email').setValidators([]);
      this.form.get('cid').setValidators([Validators.max(999999999999)]);

      this.form.updateValueAndValidity();
    }
  }

  onPlace(event: Place): void {
    this.addressClicked(event);
  }
}
