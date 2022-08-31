import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems, MenuItem } from '../../../shared/menu-items/menu-items';
import { FacadeService } from '@dms/services/facade.service';
import { Routes } from '@dms/app/constants/routes';
import { Router, NavigationEnd } from '@angular/router';
import { FilterService } from '@dms/app/services/state-management/filter.service';
import { MatSlideToggleChange } from '@angular/material';
import { Images } from '@dms/app/constants/images';
import { App } from '../../../core/app';
import { Admin } from '../../../models/settings/profile/Admin';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  avatar: string = Images.user;
  private _mobileQueryListener: () => void;
  list: MenuItem[] = [];

  dashboard: string;
  isLoggedIn: boolean;
  homeIsActive: boolean = false;
  fullname: string = '';
  state: any;
  adminInfo: Admin;
  bankLogo: string = null;
  public readonly baseUrl = App.backEndUrl;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private facadeService: FacadeService,
    private router: Router,
    private filterService: FilterService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    router.events.subscribe((value) => {
      if (value instanceof NavigationEnd && value.url == Routes.main) {
        this.homeIsActive = true;
      } else {
        this.homeIsActive = false;
      }
    });

    this.filterService.currentStatus.subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit() {
    if (this.facadeService.accountService.isLoggedIn) {
      this.list = this.menuItems.getMenuitem();
      this.dashboard = Routes.dashboard;
      this.fullname = this.facadeService.accountService.user.fullName;
    }

    this.facadeService.authenticatedService.currentStatus.subscribe(state => {
      if (state) {
        this.fullname = this.facadeService.accountService.user.fullName;
        this.getAdminInfo();
      }
    });
  }

  getAdminInfo() {
    this.facadeService.adminService.GetCurrentAdmin().subscribe(admin => {
      this.adminInfo = admin;
      if (this.adminInfo.bankLogoURL)
        this.bankLogo = `${this.baseUrl}/${this.adminInfo.bankLogoURL}`;
      else
        this.bankLogo = 'assets/images/users/avatar.png';

    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /**
   * clear storage
   *
   *
   */
  signOut() {
    const userId: string = this.facadeService.accountService.user.id;

    this.facadeService.accountService.logoutSession(userId).subscribe(res => {
      this.facadeService.accountService.logout();
      this.router.navigate(['auth/login']);
    });
  }

  /**
   * change language
   *
   *
   * @param event
   */
  onChangeLanguage(event: MatSlideToggleChange) {
    if (event.checked) {
      this.facadeService.languageService.changeLanguage('ar');
    } else {
      this.facadeService.languageService.changeLanguage('en');
    }
  }
}
