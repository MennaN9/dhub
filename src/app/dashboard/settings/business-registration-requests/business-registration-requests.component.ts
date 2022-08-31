import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-business-registration-requests',
  templateUrl: './business-registration-requests.component.html',
  styleUrls: ['./business-registration-requests.component.scss']
})
export class BusinessRegistrationRequestsComponent implements OnInit {
  newStatus = ['New'];
  pendingStatus = ['Pending'];
  approvedAndRejectedStatus = ['Approved', 'Rejected'];

  constructor() { }

  ngOnInit() {
  }

}
