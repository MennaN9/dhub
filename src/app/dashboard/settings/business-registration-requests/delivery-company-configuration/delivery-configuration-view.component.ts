import { ActivatedRoute, Router } from '@angular/router';
import { startWith } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { SnackBar } from '@dms/app/utilities/snakbar';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgModel,
  Validators,
} from "@angular/forms";
import {
  MatCheckboxChange,
  MatDialog,
  MatRadioChange,
  MatTableDataSource,
} from "@angular/material";
import {
  BusinessRegistrationService,
  Type,
} from "@dms/app/services/tanent/business-registration.service";
import { FacadeService } from "@dms/services/facade.service";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { TanentConfig } from '@dms/app/models/tanent/tanent-config';

@Component({
  selector: "app-delivery-configuration-view",
  templateUrl: "./delivery-configuration-view.component.html",
  styleUrls: ["./delivery-configuration-view.component.scss"],
})
export class DeliveryConfigurationViewComponent implements OnInit {
  fromSelect: any[];
  uniqeId = 1;
  deliveryform: FormGroup;
  subscriptions = new Subscription();
  types: Type[] = [];
  geos: any;
  distanceOption: number;
  ischecked: boolean = false;
  preValue;
  preindex;

  dataTable = [];
  formObject: any;
  div1: boolean = true;
  showTable: boolean = false;
  tenantId: string;
  companyName: string;
  index: any;
  itemobj: any;
  details: any;
  list: any;




  displayedColumns: string[] = ['From', 'To', 'Desc', 'Action'];
  dataSource = new MatTableDataSource(this.dataTable);


  constructor(
    private fb: FormBuilder,
    private businessRegistrationService: BusinessRegistrationService,
    private translateService: TranslateService,
    private FacadeService: FacadeService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: SnackBar,
  ) {
    this.deliveryform = this.fb.group({
      //tenantId
      //deliveryDetails
      isSupportingAPIIntegration: [false, [Validators.required]],
      apiIntegrationURL: ['', []],
      // fromGeofences: this.fb.array([], [Validators.required]),
      // toGeofences: this.fb.array([], [Validators.required]),
      fromGeofences: [this.geos, [Validators.required]],
      toGeofences: [this.geos, [Validators.required]],
      feesCalculationType: [null, [Validators.required]],
      fixedFees: [null],
      externalFees: [null],
      distance: new FormArray([]),

    });
    this.addDistance();
    this.getData();
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tenantId = params.id;
    });
    this.route.params.subscribe(params => {
      this.companyName = params.name;
    });
    this.subscriptions.add(
      this.businessRegistrationService.getAllDistance().subscribe((types) => {
        this.types = types;
      })
    );
    this.subscriptions.add(
      this.FacadeService.geoFenceService.getAllGeoPance().subscribe((types) => {
        this.geos = types;

        // const selections = this.geos.map((t) => t.id);
      })
    );
    // this.route.snapshot.params.id;

  }
  get distance() {
    return this.deliveryform.controls["distance"] as FormArray;
  }
  getData() {
    this.FacadeService.TenantConfigurationService.requestdetailsById(this.tenantId).subscribe((res) => {
      this.list = res;
      console.log(this.list);
      // this.list.forEach(x => {
      //   this.deliveryform.patchValue({
      //     id: x.id,
      //     deposit: x.deposit,
      //     year: x.year,
      //     maturity: x.maturity
      //   })
      // })
    }
    )
  }
  convertToInt(value: number): number {
    return Number(value);
  }

  onChangePreviousValue(value: number, index: number) {
    // debugger;
    this.preValue = value;
    this.preindex = index;
    return this.preValue, this.preindex
  }

  addDistance() {
    let value = this.convertToInt(this.preValue) + 0.1;
    const distanceForm = this.fb.group({
      fromDistance: [value, []],
      toDistance: [, []],
      fees: [, []],
    });

    this.distance.push(distanceForm);
    //  return distanceForm;
  }
  deleteDistance(index: number) {
    this.distance.removeAt(index);
  }
  onChangeRadioButton(event: MatRadioChange) {
    this.distanceOption = event.value;
    this.deliveryform.get("fixedFees").setValue(null);
    this.deliveryform.get("externalFees").setValue(null);
    this.deliveryform.get("distance").reset();
    return this.distanceOption
  }
  onChangeApi(event: MatCheckboxChange) {
    this.ischecked = event.checked;
    this.deliveryform.get("apiIntegrationURL").setValue(null);
    //console.log(this.ischecked);
  }

  addToTable() {
    if (this.deliveryform.valid) {
      //   console.log('valid')
      this.formObject = {
        fromGeofences: this.deliveryform.value.fromGeofences,
        toGeofences: this.deliveryform.value.toGeofences,
        feesCalculationType: this.deliveryform.value.feesCalculationType,
        fixedFees: this.deliveryform.value.fixedFees,
        externalFees: this.deliveryform.value.externalFees,
        distanceFees: this.deliveryform.value.distance,
      }

      this.dataTable.push(this.formObject);

      // if (this.distanceOption == 2 || this.distanceOption == 3) {
      //   for (let i = 0; i <= this.dataTable.length; i++) {
      //     this.dataTable[i].distanceFees = []
      //   }
      // }
      //this.deliveryform.reset();
      //for reset form except api integration data
      this.resetFormInputs();
      // this.div1 = false;
      console.log(this.dataTable);
      if (this.dataTable.length == 0) {
        this.showTable = false
      }
      else {
        this.showTable = true
      }
    }
  }

  resetFormInputs() {
    const exclude: string[] = ['isSupportingAPIIntegration', 'apiIntegrationURL'];

    Object.keys(this.deliveryform.controls).forEach(key => {
      if (exclude.findIndex(q => q === key) === -1) {
        this.deliveryform.get(key).reset();
      }
    });
  }

  submit() {
    if (this.dataTable.length != 0) {
      let body = {
        tenantId: this.tenantId,
        isSupportingAPIIntegration: this.deliveryform.value.isSupportingAPIIntegration,
        apiIntegrationURL: this.deliveryform.value.apiIntegrationURL,
        deliveryDetails: [...this.dataTable]
      }
      // if (this.distanceOption == 2 || this.distanceOption == 3) {
      //   for (let i = 0; i <= body.deliveryDetails.length; i++) {
      //     body.deliveryDetails[i].distanceFees.clear()
      //   }
      // }
      this.FacadeService.TenantConfigurationService.Add(body).subscribe(res => {
        console.log(body)
        this.snackBar.openSnackBar({
          message: this.translateService.instant('Tenant configuration is added successfully'),
          action: this.translateService.instant('Ok'),
          duration: 2500
        });


      });
    }
  }

  editRow(row) {
    // debugger;
    console.log(row)
  }

  deleteRow(id) {
    console.log(id)
    const i = this.dataTable.findIndex(e => e.id === id)
    if (i == -1) {
      this.dataTable.splice(i, 1)
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
