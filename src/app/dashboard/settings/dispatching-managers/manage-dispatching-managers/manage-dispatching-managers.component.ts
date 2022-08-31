import { DispatchingManagers } from '@dms/app/models/settings/DispatchingManagers';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { ManageRestaurantComponent } from '../../restaurants/manage-restaurant/manage-restaurant.component';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { GeoFence } from '@dms/app/models/settings/GeoFence';
import { Branch } from '@dms/app/models/settings/branch';
import { Restaurant } from '@dms/app/models/settings/restaurant';
import { Manager } from '@dms/app/models/settings/Manager';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-manage-dispatching-managers",
  templateUrl: "./manage-dispatching-managers.component.html",
  styleUrls: ["./manage-dispatching-managers.component.scss"],
})
export class ManageDispatchingManagersComponent implements OnInit {
  form: FormGroup;
  formTitle: string;
  formAction: string;

  branches: Branch[] = [];
  tempBranches: Branch[] = [];
  geoFences: GeoFence[] = [];
  restaurants: Restaurant[] = [];
  managers: Manager[] = [];

  selectedZones: GeoFence[] = [];
  selectedRestuarants: Restaurant[] = [];
  selectedBranches: Branch[] = [];

  dispatchingManager: DispatchingManagers;

  isSubmitted: boolean = false;


  /**
   *
   * @param dialogRef
   * @param data
   * @param facadeService
   * @param snackBar
   * @param fb
   */
  constructor(
    public dialogRef: MatDialogRef<ManageRestaurantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      id: [0],
      designationName: [null, [Validators.required]],
      managerId: [null, [Validators.required]],
      restaurantsCtrl: [["All"]],
      branchesCtrl: [["All"]],
      zonesCtrl: [["All"]],
    });

    if (data.type == "edit" && data.dispatchingManager) {
      this.formAction = "Update";
      this.formTitle = "Edit";
      this.form.patchValue(this.data.dispatchingManager, {
        emitEvent: true,
        onlySelf: true,
      });
      this.dispatchingManager = data.dispatchingManager;
      this.fillFormData();
    }
    if (this.data.type == 'edit') {
      this.formAction = this.translateService.instant(`Update`);
      this.formTitle = this.translateService.instant(`Edit`);
    } else {
      this.formTitle = this.translateService.instant(`Add`);
      this.formAction = this.translateService.instant(`Create`);
    }
  }

  /**
   * Fill form with dispatching Manager data in edit mode.
   *
   *
   */
  fillFormData() {
    if (this.dispatchingManager.branches != "All") {
      this.form
        .get("branchesCtrl")
        .setValue(
          this.dispatchingManager.branches.split(",").map((branch) => +branch)
        );
    }
    if (this.dispatchingManager.zones != "All") {
      this.form
        .get("zonesCtrl")
        .setValue(
          this.dispatchingManager.zones.split(",").map((zone) => +zone)
        );
    }
    if (this.dispatchingManager.restaurants != "All") {
      this.form
        .get("restaurantsCtrl")
        .setValue(
          this.dispatchingManager.restaurants
            .split(",")
            .map((restaurant) => +restaurant)
        );
    }
  }

  ngOnInit() {
    this.getRestaurants();
    this.getGeoFences();
    // this.getBranches();

    this.getManagers();
    let restaurants = this.form.value.restaurantsCtrl;
    let zones = this.form.value.zonesCtrl;
    this.getBranches(restaurants, zones);
  }

  /**
   * get all Restaurants
   *
   *
   */
  getRestaurants() {
    this.facadeService.restaurantService.list().subscribe((restaurants) => {
      this.restaurants = restaurants;
    });
  }

  /**
   * get all GeoFence
   *
   *
   */
  getGeoFences() {
    this.facadeService.geoFenceService.list().subscribe((geoFences) => {
      this.geoFences = geoFences;
    });
  }

  /**
   * get All Branches
   *
   *
   */
  // getBranches() {
  //   this.facadeService.branchService.list().subscribe((branches) => {
  //     this.branches = branches;
  //     this.tempBranches = branches;
  //   });
  // }

  /**
   * get all managers
   *
   *
   */
  getManagers() {
    this.facadeService.managerService.list().subscribe((managers) => {
      this.managers = managers;
    });
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
      this.isSubmitted = false;
      return;
    }
    let body = this.form.value;

    body["branches"] = this.form.get("branchesCtrl").value.toString()
      ? this.form.get("branchesCtrl").value.toString()
      : "All";

    body["restaurants"] = this.form.get("restaurantsCtrl").value.toString()
      ? this.form.get("restaurantsCtrl").value.toString()
      : "All";

    body["zones"] = this.form.get("zonesCtrl").value.toString()
      ? this.form.get("zonesCtrl").value.toString()
      : "All ";

    switch (this.data.type) {
      case 'create':
        this.facadeService.dispatchingManagersService.create(body).subscribe(createResult => {
          const message: Body = {
            message: this.translateService.instant(`Success Dispatching Managers has been Created !`),
            action: this.translateService.instant(`Okay`),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        });
        break;

      case 'edit':
        body['id'] = this.dispatchingManager.id;
        this.facadeService.dispatchingManagersService.update(body).subscribe(createResult => {
          const message: Body = {
            message: this.translateService.instant(`Success Dispatching Managers has been Updated !`),
            action: this.translateService.instant(`Okay`),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);
          this.dialogRef.close(true);
        }, error => {
          this.isSubmitted = false;
        });
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
      case 'designationName':
        if (this.form.get('designationName').hasError('required')) {
          return this.translateService.instant(`Designation Name required`);
        }
        break;

      case 'managerId':
        if (this.form.get('managerId').hasError('required')) {
          return this.translateService.instant('Manager Name required');
        }
        break;

      default:
        break;
    }
  }

  /**
   *
   * @param event
   * @param selectType
   */
  onChange(event: MatSelectChange, selectType: string) {
    const value = event.value;
    // this.branches = this.tempBranches;
    let restaurants = this.form.value.restaurantsCtrl;
    let zones = this.form.value.zonesCtrl;
    this.getBranches(restaurants, zones);

    switch (selectType) {
      case "zones":
        let zonesIds: any[] = [];
        zonesIds.push(...value);

        this.selectedZones = zonesIds;

        this.branches = this.branches.filter((branch: any) => {
          return (
            this.selectedZones.includes(branch.geoFenceId) &&
            this.selectedRestuarants.includes(branch.restaurantId)
          );
        });

        this.selectedBranches = this.selectedBranches.filter((branch: any) => {
          return (
            this.selectedZones.includes(branch.geoFenceId) &&
            this.selectedRestuarants.includes(branch.restaurantId)
          );
        });
        break;

      case "restaurants":
        let restaurantsIds: any[] = [];
        restaurantsIds.push(...value);

        this.selectedRestuarants = restaurantsIds;
        this.branches = this.branches.filter((branch: any) => {
          return (
            this.selectedZones.includes(branch.geoFenceId) &&
            this.selectedRestuarants.includes(branch.restaurantId)
          );
        });
        this.selectedBranches = this.selectedBranches.filter((branch: any) => {
          return (
            this.selectedZones.includes(branch.geoFenceId) &&
            this.selectedRestuarants.includes(branch.restaurantId)
          );
        });


        this.selectedRestuarants = restaurantsIds;
        this.branches = this.branches.filter((branch: any) => {
          return this.selectedZones.includes(branch.geoFenceId) && this.selectedRestuarants.includes(branch.restaurantId);
        });
        this.selectedBranches = this.selectedBranches.filter((branch: any) => {
          return (
            this.selectedZones.includes(branch.geoFenceId) &&
            this.selectedRestuarants.includes(branch.restaurantId)
          );
        });



        this.form.get('branchesCtrl').setValue(this.form.get('branchesCtrl').value.filter((b) => {
          if (this.branches.findIndex(x => x.id == b) > -1) {
            return true;
          } else {
            return false;
          }
        }));
        break;

      default:
        break;
    }
  }

  /**
   * 
   * @param restaurantsIds 
   * @param zones 
   */
  getBranches(restaurantsIds, zones) {
    this.branches = [];
    let zonesCollection: string = "";
    let restaurantsIdsCollection: string = "";

    zones.forEach((element) => {
      if (zonesCollection != "")
        zonesCollection = `${zonesCollection},${element}`;
      else zonesCollection = `${element}`;
    });

    restaurantsIds.forEach((element) => {
      if (restaurantsIdsCollection != "") {
        restaurantsIdsCollection = `${restaurantsIdsCollection},${element}`;
      } else {
        restaurantsIdsCollection = `${element}`
      };
    });

    this.facadeService.branchService.GetBranchesBy(restaurantsIdsCollection, zonesCollection).subscribe((p) => {
      this.branches = p;
    });
  }
}
