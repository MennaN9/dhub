import { Component, OnInit } from '@angular/core';
import { TermsAndConditions } from '../../../models/settings/terms-and-conditions';
import { FacadeService } from '../../../services/facade.service';
import { SnackBar } from '../../../utilities';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  termsAndConditions: TermsAndConditions;
  constructor(
    private facadeService: FacadeService,
    private snackBar: SnackBar) {
    this.termsAndConditions = new TermsAndConditions();
  }

  ngOnInit() {
    this.getDriverTermsAndConditions();
  }

  getDriverTermsAndConditions() {
    this.facadeService.driverTermsAndConditionsService.getDriverTermsAndConditions().subscribe(result => {
      this.termsAndConditions = result;
    });
  }

  save() {
    this.facadeService.driverTermsAndConditionsService.updateDriverTermsAndConditions(this.termsAndConditions).subscribe(result => {
      this.snackBar.openSnackBar({ message: "Terms updated sucessfully", action: 'okay', duration: 2500 });
    });
  }
}
