import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Routes } from '@dms/constants/routes';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { Driver } from '@dms/models/settings/Driver'
import { Team } from '@dms/models/settings/Team';
// import { MatSelect, MatCheckbox } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GeoFence, polyCoordinates } from '@dms/models/settings/GeoFence';
import { Router } from '@angular/router';
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
import { TranslateService } from '@ngx-translate/core';
import { Body, SnackBar } from '@dms/utilities/snakbar';

@Component({
  selector: 'app-manage-geo-fence',
  templateUrl: './manage-geo-fence.component.html',
  styleUrls: ['./manage-geo-fence.component.scss']
})

export class ManageGeoFenceComponent implements OnInit, AfterViewInit {
  private map: any;
  private layer: any;
  private drawControl: any;

  entireTeam: boolean = false;

  allDrivers: Driver[] = [];
  drivers: Driver[] = [];
  allteams: Team[] = [];
  selectedteams: Team[] = [];

  form: FormGroup;
  geoFenceId: number;
  polyLayers = [];
  locations: polyCoordinates[] = [];

  // @ViewChild('teamSelect', { static: true }) teamsSelectList: MatSelect;
  // @ViewChild('entireTeamCheckbox', { static: true }) entireTeamCheckbox: MatCheckbox;

  polygonCoordinates: any[] = [];
  editMode: boolean = false;
  geoFence: GeoFence;
  previousLocations: any[] = [];
  isSubmitted: boolean = false;
  fences: GeoFence[];
  loading: boolean = false;
  drawnItems = new Leaflet.FeatureGroup();
  label: string = this.translateService.instant('Add');
  lat: number = 29.3044;
  lng: number = 47.9443;
  isDeleteing: boolean = false;
  mapInitialized: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facadeService: FacadeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBar,
    private translateService: TranslateService,
    // private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      // drivers: [''],
      // teams: [''],
      description: [''],
      locations: ['']
    });

    this.drawControl = new Leaflet.Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
        remove: false,
        edit: false
      },

      draw: {
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
      }
    });
  }

  ngOnInit() {
    // this.getTeams();
    // this.getDrivers();

    // this.form.get('drivers').setValue(this.drivers.map(driver => driver.id));
    // this.entireTeamCheckbox.change.subscribe(checkbox => {
    //   if (checkbox.checked) {
    //     this.form.get('drivers').setValue(this.drivers.map(driver => driver.id));
    //   } else {
    //     this.form.get('drivers').setValue(null);
    //   }
    // });

    // this.teamsSelectList.valueChange.subscribe((value: any[]) => {
    //   if (this.allDrivers.length > 0) {
    //     this.drivers = this.allDrivers.filter(driver => value.includes(driver.teamId));
    //     this.form.get('drivers').enable();
    //     this.entireTeamCheckbox.writeValue(false);
    //   }
    // });

    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.geoFenceId = params.id;
        this.label = this.translateService.instant('Edit');
        this.editMode = true;
        this.getGeoFence(this.geoFenceId);
      } else {
        this.getUserInfo();
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  /**
   * user info
   *
   *
   */
  getUserInfo() {
    this.facadeService.ipInfoService.position.then(position => {
      this.lat = position.latitude;
      this.lng = position.longitude;
    });
  }

  /**
   *Fill Form Data in Edit mode
   *
   */
  fillFormData() {
    this.drawControl = new Leaflet.Control.Draw({
      edit: {
        featureGroup: this.drawnItems
      },

      draw: {
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false
      }
    });

    this.form.patchValue(this.geoFence);
    this.locations = this.geoFence.locations;
    // if (this.editMode && this.geoFence.drivers.length > 0 && this.geoFence.drivers.length > 0) {
    //   this.drivers = this.allDrivers.filter((driver: any) => driver.teamId == this.teamsSelectList.value);

    //   this.form.get('drivers').enable();

    //   this.geoFence.teams.forEach(team => {
    //     const selectedTeam = this.allteams.find(x => x.id == team.id);

    //     if (selectedTeam != null && selectedTeam != undefined) {
    //       this.selectedteams.push(selectedTeam);
    //       this.teamsSelectList.valueChange.emit(selectedTeam);
    //     }
    //   });

    //   this.form.get('teams').setValue(this.selectedteams.map(team => team.id));
    //   this.entireTeamCheckbox.writeValue(false);
    // }
  }

  /**
    *Fetch geo Fence data
    *
    */
  getGeoFence(geoFenceId) {
    this.facadeService.geoFenceService.get(geoFenceId).subscribe(geoFence => {
      this.geoFence = geoFence;

      this.fillFormData();
      this.previousLocations = this.geoFence.locations;

      if (this.mapInitialized) {
        this.getGeoPolyon();
      }
    });
  }

  /**
   *Fetch Driver list
   *
   */
  // getDrivers() {
  //   this.facadeService.driverService.list().subscribe(drivers => {
  //     this.allDrivers = drivers;

  //     this.teamsSelectList.valueChange.subscribe((value: any) => {
  //       this.drivers = this.allDrivers.filter((driver: any) => value.includes(driver.teamId));
  //       this.form.get('drivers').enable();
  //       this.entireTeamCheckbox.writeValue(false);
  //     });

  //     if (this.selectedteams) {
  //       this.teamsSelectList.valueChange.emit(this.selectedteams.map(team => team.id));
  //     }
  //   });
  // }


  /**
   *Fetch Team list
   *
   */
  // getTeams() {
  //   this.facadeService.teamsService.list().subscribe(teams => {
  //     this.allteams = teams;

  //     if (this.editMode == true && this.geoFence) {
  //       this.geoFence.teams.forEach(team => {

  //         const selectedTeam = this.allteams.find(t => t.id == team.id);
  //         if (selectedTeam != null && selectedTeam != undefined) {
  //           this.selectedteams.push(selectedTeam);
  //         }
  //       });

  //       this.form.get('teams').setValue(this.selectedteams.map(team => team.id));
  //       this.teamsSelectList.valueChange.emit(this.selectedteams.map(team => team.id));
  //     }
  //   });
  // }

  /**
   * return to feo fence list
   *
   */
  cancel() {
    this.router.navigate([Routes.geoFence]);
  }

  /**
   * update geo fence name
   *
   *
   * @param event
   */
  onType(event) {
    if (this.layer) {
      this.layer.unbindTooltip();

      this.layer.bindTooltip(event.target.value,
        { permanent: true, direction: "center" }
      ).openTooltip();

      this.map.addLayer(this.layer);
    }
  }

  /**
   * create / edit geo fence
   *
   *
   */
  onSubmit() {
    this.isSubmitted = true;
    if (this.locations.length == 0 || this.isDeleteing) {

      this.isSubmitted = false;
      return this.snackBar.openSnackBar({ message: this.translateService.instant('Please select Fence'), action: this.translateService.instant('Okay'), duration: 2000 });
    }

    //if (this.drivers.length == 0) {
    //  return this.snackBar.openSnackBar({ message: 'Please select driver(s)', action: 'Okay', duration: 2000 });
    //}

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.isSubmitted = false;
      return;
    }

    this.form.get('locations').setValue(this.locations);
    let body = this.form.value;

    if (!this.editMode) {
      this.facadeService.geoFenceService.create(body).subscribe(geoFence => {
        const message: Body = {
          message: this.translateService.instant('Geo fence has been added successfully'),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }

        this.snackBar.openSnackBar(message);
        this.isSubmitted = false;
        this.router.navigate([Routes.geoFence]);

      }, error => {
        this.isSubmitted = false;
      });
    } else {
      body.id = this.geoFence.id;
      this.facadeService.geoFenceService.update(body).subscribe(geoFence => {
        const message: Body = {
          message: this.translateService.instant('Geo fence has been updated successfully!'),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }

        this.snackBar.openSnackBar(message);
        this.isSubmitted = false;
        this.router.navigate([Routes.geoFence]);
      }, error => {
        this.isSubmitted = false;
      });
    }
  }


  /**
  * draw polygons
  *
  *
  * @param shaps
  */
  drawPolyon(shap) {
    const polygon = Leaflet.polygon(shap);
    this.drawnItems.addLayer(polygon);

    //set view Map on ploygon
    this.map.fitBounds(polygon.getBounds());
  }

  /**
    *Geo Polyon in Edit mode
    *
    */
  getGeoPolyon() {
    // draw polyons in edit mode
    let coordinates = [];
    if (this.geoFence.locations.length > 0) {
      this.geoFence.locations.forEach(point => {
        coordinates.push([+point.latitude, +point.longitude]);
      });
      this.drawPolyon(coordinates);
    }
  }


  /**
    * init Map
    *
    */
  private initializeMap(lat: number = this.lat, lng: number = this.lng): void {
    this.map = Leaflet.map('map', {
      center: [+lat, +lng],
      zoom: 9
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    tiles.addTo(this.map);

    // toolbar
    this.map.addLayer(this.drawnItems);
    this.map.addControl(this.drawControl);

    this.onEdit();
    this.onCreate();
    this.onDraw();
    this.onDelete();

    this.mapInitialized = true;
  }

  /**
   * on create zone
   *
   *
   */
  onCreate() {
    this.map.on(Leaflet.Draw.Event.CREATED, (event: any) => {

      const type = event.layerType;
      this.layer = event.layer;

      if (type === 'rectangle' || type === 'polygon') {

        let polygonCoordinates = this.layer._latlngs;
        polygonCoordinates.map(element => {
          element.latitude = element.lat;
          element.longitude = element.lng;

          element.forEach((location, index: number) => {
            this.locations.push({ latitude: location.lat, longitude: location.lng, pointIndex: index + 1 });
          });
        });
      }

      this.map.addLayer(this.layer);
    });
  }

  /**
   * on edit zone
   *
   *
   */
  onEdit() {
    // on edit start
    this.map.on(Leaflet.Draw.Event.EDITED, (event: any) => {
      const polygonCoordinates = event.layers._layers;
      const coordinates: any[] = Object.values(polygonCoordinates);

      coordinates[0]._latlngs.map(element => {
        element.latitude = element.lat;
        element.longitude = element.lng;

        this.locations = [];
        element.forEach((location, index) => {
          this.locations.push({ latitude: location.lat, longitude: location.lng, pointIndex: index + 1 });
        });
      });
    });
  }

  /**
   * on draw zone
   *
   *
   */
  onDraw() {
    this.map.on(Leaflet.Draw.Event.DRAWSTART, (event: any) => {
      this.locations = [];
      this.drawnItems.clearLayers();
    });
  }

  /**
   * on delete zone
   *
   *
   */
  onDelete() {
    this.map.on(Leaflet.Draw.Event.DELETED, (event: any) => {
      this.locations = [];
      this.isDeleteing = false;
    });

    this.map.on(Leaflet.Draw.Event.DELETESTART, (event: any) => {
      this.locations = [];
      this.isDeleteing = false;
    });
  }

  /**
   * list all geo fences
   *
   *
   */
  list() {
    this.loading = true;
    this.facadeService.geoFenceService.list().subscribe(result => {
      this.fences = result;

      this.fences.forEach(fence => {
        let shap: any[] = fence.locations;

        let coordinates = [];
        shap.forEach(point => {
          coordinates.push([+point.latitude, +point.longitude]);
        });

        this.drawPolyon(coordinates);
      });

      this.loading = false;
    })
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

      case 'drivers':
        if (this.form.get('drivers').hasError('required')) {
          return this.translateService.instant(`driver(s) required`);
        }
        break;

      case 'description':
        if (this.form.get('description').hasError('required')) {
          return this.translateService.instant(`Description required`);
        }
        break;
    }
  }

}
