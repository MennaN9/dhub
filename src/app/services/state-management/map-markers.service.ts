import { Injectable } from '@angular/core';
import { MapMarker } from '@dms/app/models/main/tasks/map-marker';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapMarkersService {

  private markersToUpdate: MapMarker[] = [];
  private mapView: Subject<MapMarker> = new Subject<MapMarker>();
  private markers: Subject<MapMarker[]> = new Subject<MapMarker[]>();
  private driversMarkers: Subject<MapMarker[]> = new Subject<MapMarker[]>();

  public currentMarkers = this.markers.asObservable();
  public currentView = this.mapView.asObservable();
  public currentDriversMarkers = this.driversMarkers.asObservable();

  constructor() {
    this.currentDriversMarkers.subscribe(markers => {
      this.markersToUpdate = markers;
    });
  }

  changeMarkers(value: MapMarker[], isDriverList: boolean) {
    if (isDriverList) {
      this.driversMarkers.next(value);
    }

    this.markers.next(value);
  }

  changeView(value: MapMarker) {
    this.mapView.next(value);
  }

  /**
   * update driver location on map
   * 
   * 
   * 
   * @param driverId 
   * @param lat 
   * @param lng 
   */
  onDriverLocationChanged(driverId: string, lng: string, lat: string): void {
    this.markersToUpdate.forEach((marker: MapMarker) => {
      if (marker.driver.userId == driverId) {
        marker['driver']['latitude'] = lat;
        marker['driver']['longitude'] = lng;

        marker.lat = +lat;
        marker.lng = +lng;
      }
    });

    this.driversMarkers.next(this.markersToUpdate);
  }

}
