import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Images } from '@dms/app/constants/images';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';

interface CardRouteData {
  driver?: string | null;
  address?: string | null;
  time?: number
  distance?: number;
  taskType?: string;
}

@Component({
  selector: 'app-task-tracking',
  templateUrl: './task-tracking.component.html',
  styleUrls: ['./task-tracking.component.scss']
})
export class TaskTrackingComponent implements OnInit, AfterViewInit {

  // kuwait
  lat: Number = 29.378586;
  lng: Number = 47.990341;
  queryParams: any;

  origin: any;
  destination: any;

  markerOptions = {
    origin: {
      icon: Images.driverLocation,
    },
    destination: {
      icon: Images.taskLocation,
    },
  }

  renderOptions = {
    suppressMarkers: true,
  }

  cardRouteData: CardRouteData;
  private map: any;
  private routeCtrl: Leaflet.Routing.Control;
  waypoints: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;
    });
  }

  ngOnInit() {
    this.origin = {
      lat: Number(this.queryParams.driverLat),
      lng: Number(this.queryParams.driverLng),
    }

    this.destination = {
      lat: Number(this.queryParams.taskLat),
      lng: Number(this.queryParams.taskLng)
    }

    this.waypoints.push(this.origin, this.destination);
    this.cardRouteData = {
      driver: this.queryParams.driver,
      address: this.queryParams.address,
      taskType: this.queryParams.taskType,
    }
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [+this.lat, +this.lng],
      zoom: 5
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    const iconRetinaUrl = 'assets/images/markers/marker-icon-2x.png';
    const iconUrl = 'assets/images/markers/marker-icon.png';
    const shadowUrl = 'assets/images/markers/marker-shadow.png';
    const iconDefault = Leaflet.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Leaflet.Marker.prototype.options.icon = iconDefault;

    this.routeCtrl = Leaflet.Routing.control({
      waypoints: [],
      addWaypoints: false,
      routeWhileDragging: false,
      lineOptions: {
        missingRouteTolerance: 0,
        extendToWaypoints: true,
        styles: [{ color: 'blue', opacity: 0.35, weight: 7 }],
      }
    }).addTo(this.map);

    this.routeCtrl.setWaypoints(this.waypoints);

    this.routeCtrl.on('routesfound', event => {
      console.log(event.routes[0].summary);

      const DISTANC = Number(event.routes[0].summary.totalDistance) / 1000;
      const TIME = Number(event.routes[0].summary.totalTime) / 60;

      this.cardRouteData.distance = +DISTANC.toFixed(1);
      this.cardRouteData.time = +TIME.toFixed(1);
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }
}
