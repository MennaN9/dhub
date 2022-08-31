import { Component, OnInit } from '@angular/core';
import { Admin } from '@dms/app/models/settings/profile/Admin';
import { ActivatedRoute } from '@angular/router';
import { ChangeLanguage } from '@dms/app/models/settings/profile/ChangeLanguage';
import { FacadeService } from '@dms/app/services/facade.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  panelOpenState = false;
  step = 0;
  currentUser: Admin;
  userLanguages: ChangeLanguage;
  isTenant: boolean = false;

  /**
   * 
   * @param route 
   * @param facadeService 
   */
  constructor(private route: ActivatedRoute, private facadeService: FacadeService) {
  }

  ngOnInit(): void {
    this.currentUser = this.route.snapshot.data.userInfo;
    this.userLanguages = { DashBoardLanguage: this.currentUser.dashBoardLanguage }
    if (this.facadeService.accountService.isTenant) {
      this.isTenant = true;
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}

