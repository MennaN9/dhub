import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from '@dms/services/facade.service';
import { GeoFence } from '@dms/models/settings/GeoFence';
import * as Leaflet from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientService } from '../../../core/http-client/http-client.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { saveFile } from '@dms/app/utilities/generate-download-file';

@Component({
  selector: 'app-geo-fence',
  templateUrl: './geo-fence.component.html',
  styleUrls: ['./geo-fence.component.scss']
})

export class GeoFenceComponent implements OnInit, AfterViewInit {
  private static readonly ROUTE_ADD = 'app/settings/geo-fence/add';
  private static readonly ROUTE_EDIT = 'app/settings/geo-fence/edit';
  private map;

  public readonly dialogContent = {
    title: this.translateService.instant("Are you sure you want to delete this geo fence? You won't be able to restore the data."),
    openBtn: this.translateService.instant("Delete"),
    cancelBtn: this.translateService.instant("Cancel"),
    okayBtn: this.translateService.instant("Confirm"),
  }

  options: any;
  info: any;

  fences: GeoFence[] = [];
  fence: GeoFence;
  polyLayers = [];
  drawnItems = new Leaflet.FeatureGroup();

  lat: number;
  lng: number;
  locale: string;

  constructor(
    private router: Router,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
  ) {
    this.lat = 29.2891;
    this.lng = 48.0164;
  }

  ngOnInit() {
    this.facadeService.languageService.language.subscribe(lng => {
      this.locale = lng;
    });

    this.getUserInfo();
    this.list();
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

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * list all geo fences
   *
   *
   */
  list() {
    this.facadeService.geoFenceService.list().subscribe(result => {
      this.fences = result;

      this.fences.forEach(fence => {
        let shap: any[] = fence.locations;

        let coordinates = [];
        shap.forEach(point => {
          coordinates.push([+point.latitude, +point.longitude]);
        });

        this.drawPolyon(coordinates, fence.name);
      });

      //Focus on First item at fences list
      if (this.fences.length > 0) {
        this.setTSelectableFenceFocus(this.fences[0]);
      } else
        this.map.eachLayer((layer: any) => {
          this.map.removeLayer(layer);
        });

      const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      tiles.addTo(this.map);
    });
  }

  /**
   * navigate to add geo fence page
   *
   *
   */
  createGeoFence() {
    this.router.navigate([GeoFenceComponent.ROUTE_ADD]);
  }

  /**
   * navigate to edit geo fence page
   *
   *
   */
  editGeoFence() {
    const id = this.fence.id;
    this.router.navigate([GeoFenceComponent.ROUTE_EDIT, id]);
  }

  /**
   * set fence
   *
   *
   * @param fence
   */
  setTSelectableFence(fence: GeoFence) {
    this.fence = fence;
  }

  /**
  * set fence Focus on click
  *
  *
  * @param fence
  */
  setTSelectableFenceFocus(fence: GeoFence) {
    this.fence = fence;

    let coordinates = [];
    this.fence.locations.forEach(point => {
      coordinates.push([+point.latitude, +point.longitude]);
    });

    const polygon = Leaflet.polygon(coordinates);

    //set view Map on ploygon
    this.map.fitBounds(polygon.getBounds());
  }

  /**
   * delete geo fence
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.geoFenceService.delete(this.fence.id).subscribe(res => {
        const message: Body = {
          message: this.translateService.instant(`Geo Fence has been deleted successfully`),
          action: this.translateService.instant('Okay'),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);

        this.drawnItems.clearLayers();
        this.list();
      });
    }
  }

  /**
   * init map
   *
   *
   */
  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [+this.lat, +this.lng],
      zoom: 12
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    tiles.addTo(this.map);
    this.map.addLayer(this.drawnItems);
  }


  /**
   * draw fence
   *
   *
   * @param shap
   */
  drawPolyon(shap: any, fence: string) {
    const polygon = Leaflet.polygon(shap);
    this.drawnItems.addLayer(polygon);

    polygon.bindTooltip(fence,
      { permanent: true, direction: "center" }
    ).openTooltip();
  }


  /**
   * exportGeoFence to excel
   * */
  exportGeoFence() {
    this.facadeService.geoFenceService.exportToExcel().subscribe(data => {
      saveFile("GeoFences.csv", "data:attachment/text", data);
    });
  }
}

