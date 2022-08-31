import { Component, OnInit, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Images } from '@dms/app/constants/images';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import * as Leaflet from 'leaflet';
import { Subscription } from 'rxjs/internal/Subscription';

const MAP_ZOOM = 6;
const MAX_ZOOM = 18;
const MAP_MARKER_ZOOM = 12;
const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',
  styleUrls: ['./main-map.component.scss']
})
export class MainMapComponent implements OnInit, AfterViewInit, OnDestroy {

  private map: Leaflet.Map;
  marker: Leaflet.Marker;

  private subscriptions = new Subscription();
  private markersGroup = Leaflet.layerGroup();

  lat: number = 29.378586;
  lng: number = 47.990341;

  @Output() onMarker: EventEmitter<{ lat: number, lon: number }> = new EventEmitter<{ lat: number, lon: number }>();

  constructor(private mapMarkersService: MapMarkersService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.mapMarkersService.currentMarkers.subscribe((mapMarkers: MapMarker[]) => {

      // remove old
      this.markersGroup.clearLayers();

      // set new markers
      mapMarkers.forEach((marker: MapMarker) => {
        this.createMarker(marker, false);
      });
    }));

    // map zoom view
    this.subscriptions.add(this.mapMarkersService.currentView.subscribe((mapMarker: MapMarker) => {
      this.markersGroup.clearLayers();
      this.createMarker(mapMarker, true);
    }));
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    if (this.map !== null && this.map !== undefined) {
      this.map.remove();
    }

    this.map = Leaflet.map('map', {
      center: [this.lat, this.lng],
      zoom: MAP_ZOOM
    });

    Leaflet.tileLayer(TILE_LAYER, {
      maxZoom: MAX_ZOOM,
    }).addTo(this.map);
    this.markersGroup.addTo(this.map);

    const newLatLng = new Leaflet.LatLng(this.lat, this.lng);
    this.map.panTo(newLatLng);
    this.marker = Leaflet.marker(newLatLng, {
      draggable: true,
      icon: Leaflet.icon({
        iconUrl: Images.taskLocation,
        iconSize: [40, 60],
        iconAnchor: [30 / 2, 35]
      })
    }).addTo(this.map);

    this.marker.on("drag", (e) => {
      const marker = e.target;
      const position: Leaflet.LatLng = marker.getLatLng();   

      this.onMarker.emit({ lat: position.lat, lon: position.lng });
    });
  }

  /**
   * add marker on map for task / driver 
   * 
   * 
   * @param mapMarker 
   */
  private createMarker(marker: MapMarker, enableZoom: boolean): void {
    let icon = ''
    if (marker.type == 'driver') {
      icon = `assets/images/markers/${marker.driver.agentStatusName}.png`;
    } else if (marker.type == 'delivery') {
      icon = Images.deliveryIcon;
    } else {
      icon = Images.pickupIcon;
    }

    const latLng = new Leaflet.LatLng(marker.lat, marker.lng);
    let mapMarker: Leaflet.Marker = Leaflet.marker(latLng, {
      draggable: false,
      icon: Leaflet.icon({
        iconUrl: icon,
        iconSize: marker.isDriver ? [24, 24] : [60, 90],
        iconAnchor: [30 / 2, 35],
      })
    }).addTo(this.map);

    // zoom to marker view
    if (enableZoom || marker.task) {
      mapMarker.setLatLng({ lat: marker.lat, lng: marker.lng });
      this.map.setView({ lat: marker.lat, lng: marker.lng }, MAP_MARKER_ZOOM);
    }

    if (marker.isDriver) {
      mapMarker.bindTooltip(`${marker.driver.firstName} ${marker.driver.lastName}`, {
        permanent: true,
        direction: 'right'
      });
      mapMarker.addTo(this.markersGroup);
    } else {
      const address = marker.task && marker.task.address ? marker.task.address : `${marker.lat}, ${marker.lng} `;
      mapMarker.bindTooltip(address, { direction: 'right' });
      mapMarker.addTo(this.markersGroup);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
