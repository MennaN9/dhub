import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-drivers-registration-requests',
  templateUrl: './drivers-registration-requests.component.html',
  styleUrls: ['./drivers-registration-requests.component.scss']
})
export class DriversRegistrationRequestsComponent implements OnInit {
  constructor() { }

  newStatus = ['New'];
  pendingStatus = ['Pending'];
  approvedAndRejectedStatus = ['Approved', 'Rejected'];
  ngOnInit() {
  }

  // selectedTabChange(event: MatTabChangeEvent) {
  //   switch (event.index) {
  //     case 0:
  //       this.status = ['New'];
  //       break;

  //     case 1:
  //       this.status = ['Pending'];
  //       break;

  //     case 2:
  //       this.status = ['Approved', 'Rejected'];
  //       break;

  //     default:
  //       break;
  //   }
  // }

}
