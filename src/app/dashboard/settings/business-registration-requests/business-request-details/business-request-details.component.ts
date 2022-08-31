import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApproveBusinessRequestComponent } from './../approve-business-request/approve-business-request.component';
import { RejectBusinessRequestComponent } from './../reject-business-request/reject-business-request.component';
import { BusinessRegistrationRequestsService } from '@dms/app/services/tanent/business-registration-requests.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UploadTypes } from '@dms/app/constants/upload-types';
import { BusinessRegistrationService, Type } from '@dms/app/services/tanent/business-registration.service';
import { Subscription } from 'rxjs/Subscription';
import { App } from '@dms/app/core/app';
import { Address, Option } from '@dms/app/models/settings/Address';
import { MatSelectChange } from '@angular/material/select';
import { Routes } from '@dms/app/constants/routes';

const otherType = 8;

interface DeliveryInfo {
  hasOwnDrivers: boolean;
  hasMultiBranches: boolean;
  branchCount: number;
  numberOfDrivers: number;
  contractRangeName: string;
  servingRadiusInKM: number;
  numberOfOrdersByDriverPerOrder: number;
}

@Component({
  selector: 'app-business-request-details',
  templateUrl: './business-request-details.component.html',
  styleUrls: ['./business-request-details.component.scss']
})
export class BusinessRequestDetailsComponent implements OnInit {

  businessRequestId: number;
  requestDetails: any;

  businessform: FormGroup;
  ownerform: FormGroup;
  commentform: FormGroup;
  accountSettingsForm: FormGroup;

  types: Type[] = [];
  subscriptions = new Subscription();
  attachments: { id?: number, formFile: File, file?: string, type: UploadTypes }[] = [];
  baseUrl = App.backEndUrl;

  modules: Option[] = [];

  validateBusinessAddress: boolean = false;
  validateOwnerAddress: boolean = false;
  otherBusinessType: boolean = false;
  isIndividual: boolean = false;
  isHomeBusiness: boolean = false;
  isCorporateBusiness: boolean = false;
  isDeliveryCompany: boolean = false;

  businessAddress: Address;
  ownerAddress: Address;
  deliveryInfo: DeliveryInfo;

  disableAddress: boolean = false;
  fileToUpload: File;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private businessRegistrationService: BusinessRegistrationService,
    private businessRegistrationRequestsService: BusinessRegistrationRequestsService
  ) {
    this.businessform = fb.group({
      name: [''],
      email: [''],
      businessType: [''],
      otherBusinessType: [''],
      businessCID: [''],
    });

    this.ownerform = fb.group({
      ownerName: [''],
      ownerCID: [''],
      ownerPhoneNumber: [''],
    });

    this.commentform = fb.group({
      comment: [''],
    });

    this.accountSettingsForm = fb.group({
      isFullVersion: [''],
      autoAllocationMethod: [''],
      selectedModules: ['']
    });

    this.activatedRoute.params.subscribe(params => {
      this.businessRequestId = params.id;
    });
  }

  ngOnInit() {
    this.getRequestDetails();

    this.subscriptions.add(this.businessRegistrationService.getTypes().subscribe(types => {
      this.types = types;
    }));

    this.subscriptions.add(this.businessRegistrationService.defaultModules.subscribe((res: Option[]) => {
      this.modules = res;
    }));
  }

  getRequestDetails() {

    this.businessRegistrationRequestsService.requestdetails(this.businessRequestId).subscribe(res => {
      this.requestDetails = res;

      this.businessform.patchValue(this.requestDetails);
      this.ownerform.patchValue(this.requestDetails);
      this.commentform.patchValue(this.requestDetails);
      this.deliveryInfo = this.requestDetails;

      this.businessAddress = this.requestDetails.businessAddress;
      this.ownerAddress = this.requestDetails.ownerAddress;

      if (this.requestDetails.approveSettings && this.requestDetails.approveSettings.isFullVersion) {
        this.accountSettingsForm.get('isFullVersion').setValue('full');
      }

      if (this.requestDetails.approveSettings && this.requestDetails.approveSettings.selectedModules.length > 0) {
        this.accountSettingsForm.get('isFullVersion').setValue('customized');
        this.accountSettingsForm.get('selectedModules').setValue(this.requestDetails.approveSettings.selectedModules);
      }
      console.log(this.requestDetails);
     // console.log(this.requestDetails.registrationBusinessType);
      //registrationBusinessType is isIndividual
      if (this.requestDetails.registrationBusinessType == 1) {
         this.isIndividual = true
      }
      //registrationBusinessType isHomeBusiness
      if (this.requestDetails.registrationBusinessType == 2) {
        this.isHomeBusiness = true
      }
       //registrationBusinessType isCorporateBusiness
      if (this.requestDetails.registrationBusinessType == 3) {
        this.isCorporateBusiness = true
      }
      //registrationBusinessType isDeliveryCompany
      if (this.requestDetails.registrationBusinessType == 4) {
        this.isDeliveryCompany = true
     }
      // others equals to 8
      if (this.requestDetails.businessType == otherType) {
        this.otherBusinessType = true;
      }

      this.attachments = this.requestDetails.attachments;

      this.validateBusinessAddress = true;
      this.validateOwnerAddress = true;


      if (!(this.requestDetails.userRegistrationStatus == 'New' || this.requestDetails.userRegistrationStatus == 'Pending')) {
        this.businessform.disable();
        this.ownerform.disable();
        this.commentform.disable();
        this.disableAddress = true;
      }
    });
  }

  formatLink(link: string) {
    if (link.includes('http://') || link.includes('https://')) {
      return link;
    }
    else {
      return 'http://' + link;
    }
  }

  approve() {
    let dialogRef = this.dialog.open(ApproveBusinessRequestComponent, {
      width: '75%',
      maxHeight: '75vh',
      autoFocus: false,
      data: {
        id: this.businessRequestId
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.backToRequests();
    });
  }

  reject() {
    let dialogRef = this.dialog.open(RejectBusinessRequestComponent, {
      width: '50%',
      minHeight: '30%',
      maxHeight: '50%',
      data: {
        id: this.businessRequestId
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.backToRequests();
    });
  }

  onSelectAttachment(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.attachments.push({ formFile: file, type: UploadTypes.Auditing });
      this.fileToUpload = null;
    }
  }

  deleteFile(index: number) {
    this.attachments.splice(index, 1);
  }

  save() {
    const body = {
      ...this.businessform.value,
      ...this.ownerform.value,
      ... this.deliveryInfo,
      attachments: this.attachments,
    };

    // business address
    body.businessAddress = {
      governorate: this.businessAddress.governorate,
      area: this.businessAddress.area,
      block: this.businessAddress.block,
      street: this.businessAddress.street,
      building: this.businessAddress.building,
      floor: this.businessAddress.floor,
      flat: this.businessAddress.flat,
    }

    // owner address
    body.ownerAddress = {
      governorate: this.ownerAddress.governorate,
      area: this.ownerAddress.area,
      block: this.ownerAddress.block,
      street: this.ownerAddress.street,
      building: this.ownerAddress.building,
      floor: this.ownerAddress.floor,
      flat: this.ownerAddress.flat,
    }

    body.comment = this.commentform.get('comment').value;
    this.businessRegistrationRequestsService.save(body, this.businessRequestId).subscribe(res => {
      this.backToRequests();
    });
  }

  onAddressChanges(event: Address, type: string) {
    if (type == 'business') {
      this.businessAddress = event;
    } else {
      this.ownerAddress = event;
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

  onChangeType(event: MatSelectChange): void {
    if (event.value === otherType) {
      this.otherBusinessType = true;
    } else {
      this.otherBusinessType = false;
    }
  }

  backToRequests(): void {
    this.router.navigate([Routes.businessRegistrationRequests]);
  }
}
