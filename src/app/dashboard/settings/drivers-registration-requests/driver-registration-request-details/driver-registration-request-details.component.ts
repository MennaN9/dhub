import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompleteDriverProfileComponent } from './../complete-driver-profile/complete-driver-profile.component';
import { RejectDriverRegistrationRequestComponent } from './../reject-driver-registration-request/reject-driver-registration-request.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DriverRegistrationRequestsService } from '@dms/app/services/settings/driver-registration-requests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadTypes } from '@dms/app/constants/upload-types';
import { App } from '@dms/app/core/app';
import { TransportType } from '@dms/app/models/settings/TransportType';
import { FacadeService } from '@dms/app/services/facade.service';
import { Option } from '@dms/models/settings/Address';
import { Lightbox } from 'ngx-lightbox';
import { Routes } from '@dms/app/constants/routes';

@Component({
  selector: 'app-driver-registration-request-details',
  templateUrl: './driver-registration-request-details.component.html',
  styleUrls: ['./driver-registration-request-details.component.scss']
})
export class DriverRegistrationRequestDetailsComponent implements OnInit {
  [x: string]: any;

  form: FormGroup;
  driverRequestId: number;
  requestDetails: any;
  uploadTypes = UploadTypes;

  personalPhotoSrc: string = '';
  nationalIdSrc: string = '';
  drivingLicenseSrc: string = '';

  carApplicationSrc = '';
  carInsuranceSrc = '';
  carReferralDocumentSrc = '';

  termsAndConditionsSrc = '';

  vehiclePhotos: string[] = [];
  transportTypes: TransportType[] = [];

  areas: Option[] = [];
  filterArea: string = '';

  driverAttachments: { id?: number, formFile: File, file?: string, type: UploadTypes }[] = [];
  baseUrl = App.backEndUrl;

  constructor(
    private dialog: MatDialog,
    fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private lightbox: Lightbox,
    private router: Router,
    private driverRegistrationRequestsService: DriverRegistrationRequestsService) {
    this.form = fb.group({
      fullName: [''],
      userName: [''],
      email: [''],
      phoneNumber: [''],
      areaId: [''],
      transportTypeId: [''],
      jobStatusName: [''],
      car: [''],
      transportColor: [''],
      transportYearAndModel: [''],
      comment: [''],
      licensePlate: [''],
      fileSource: [null]
    });

    this.activatedRoute.params.subscribe(params => {
      this.driverRequestId = params.id;
    });
  }

  ngOnInit() {
    this.getTransportTypes();
    this.getRequestDetails();
    this.listAreas();
  }

  getRequestDetails() {
    this.driverRegistrationRequestsService.requestdetails(this.driverRequestId).subscribe(res => {
      this.requestDetails = res;
      this.form.patchValue(res);
      this.displayImages(this.requestDetails.driverAttachments);
      this.driverAttachments = this.requestDetails.driverAttachments.filter(attachment => attachment.type === this.uploadTypes.Auditing);
    });
  }

  getTransportTypes() {
    this.facadeService.TransportTypeService.list().subscribe((result: TransportType[]) => {
      this.transportTypes = result;
    });
  }

  /**
   * areas
   * 
   * 
   */
  listAreas() {
    this.facadeService.addressService.areas.subscribe((areas: Option[]) => {
      this.areas = areas;
    });
  }

  /**
   * display attachments
   * 
   * 
   * @param array 
   */
  displayImages(array: { type: string, file: string }[]): void {
    array.forEach(element => {
      switch (element.type) {
        case this.uploadTypes.PersonalPhoto:
          this.personalPhotoSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.NationalId:
          this.nationalIdSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.DrivingLicense:
          this.drivingLicenseSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.CarApplication:
          this.carApplicationSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.CarInsurance:
          this.carInsuranceSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.CarReferralDocument:
          this.carReferralDocumentSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.TermsAndConditions:
          this.termsAndConditionsSrc = `${this.baseUrl}/${element.file}`;
          break;

        case this.uploadTypes.CarFrontSide:
        case this.uploadTypes.CarBackSide:
        case this.uploadTypes.CarLeftSide:
        case this.uploadTypes.CarRightSide:
        case this.uploadTypes.CarInsidePicture:
          this.vehiclePhotos.push(`${this.baseUrl}/${element.file}`)
          break;

        default:
          break;
      }
    });
  }

  completeProfile() {
    let dialogRef = this.dialog.open(CompleteDriverProfileComponent, {
      width: '75%',
      maxHeight: '90vh',
      data: {
        requestDetails: this.requestDetails,
        personalPhotoSrc: this.personalPhotoSrc
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.backToRequests();
    });
  }

  rejectRequest() {
    let dialogRef = this.dialog.open(RejectDriverRegistrationRequestComponent, {
      width: '500px',
      minHeight: '250px',
      data: {
        driverRequestId: this.driverRequestId
      }
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      this.backToRequests();
    });
  }

  onSelectAttachment(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.driverAttachments.push({ formFile: file, type: UploadTypes.Auditing });
    }
  }

  deleteFile(index: number) {
    this.driverAttachments.splice(index, 1);
  }

  save() {
    const body = { ...this.form.value, driverAttachments: this.driverAttachments };
    this.driverRegistrationRequestsService.save(body, this.driverRequestId).subscribe(res => {
      this.backToRequests();
    });
  }

  closeLightBox(): void {
    this.lightbox.close();
  }

  /**
   * image view
   *
   *
   * @param index
   */
  openTaskSignaturesLightBox(src: string, caption?: string): void {
    const imageTodisplay = {
      src: src,
      caption: caption,
      thumb: src
    };

    let array: any[] = [];
    array.push(imageTodisplay);

    this.lightbox.open(array, 0);
  }

  backToRequests(): void {
    this.router.navigate([Routes.driversRegistrationRequests]);
  }

}
