import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { SidebarService } from '@dms/app/services/state-management/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { FacadeService } from '@dms/services/facade.service';
import { MatButtonToggleChange, MatOption, MatSelectionListChange } from '@angular/material';
import { Team } from '@dms/models/settings/Team';
import { Routes } from '@dms/constants/routes';
import { FilterService } from '@dms/app/services/state-management/filter.service';
import { Restaurant } from '@dms/app/models/settings/restaurant';
import { Branch } from '@dms/app/models/settings/branch';
import { GeoFence } from '@dms/app/models/settings/GeoFence';
import { NotificationVM } from '@dms/services/settings/notifications.service';
import { SignalRNotificationService } from '@dms/app/services/state-management/signal-rnotification.service';
import { MapMarkersService } from '@dms/app/services/state-management/map-markers.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RefreshNotificationCountService } from '@dms/app/services/state-management/refresh-notification-count.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: ['./full.component.scss'],
  providers: [
    DeviceDetectorService
  ]
})
export class FullComponent implements OnDestroy, OnInit, AfterViewInit {
  public readonly tasksRoute = Routes.tasks;
  newStatus: boolean;
  enableRoleSelect: boolean = false;
  currentState: boolean;
  enableTasksSelect: boolean = false;

  today: Date = new Date();

  teams: Team[] = [];

  restaurants: Restaurant[] = [];
  branches: Branch[] = [];
  tempBranches: Branch[] = [];
  zones: GeoFence[] = [];

  dateRange: any;

  // teamsLoading: boolean = false;
  restaurantsLoading: boolean = false;
  zonesLoading: boolean = false;
  branchesLoading: boolean = false;

  state: any;
  selectedteams: number[] = [];
  selectedBranches: number[] = [];
  selectedRestuarants: number[] = [];
  selectedZones: number[] = [];

  // teamsLoadedBefore: boolean = false;
  restaurantsLoadedBefore: boolean = false;
  branchesLoadedBefore: boolean = false;
  zonesLoadedBefore: boolean = false;

  dateValue: Date = new Date();
  start: Date = new Date();
  end: Date = new Date();
  role: string = '';
  unReadCount: number = 0;

  notifications: NotificationVM[] = [];

  @ViewChild('menuSelectedBranches', { static: false }) private menuSelectedBranches: MatOption;
  @ViewChild('menuSelectedRestaurants', { static: false }) private menuSelectedRestaurants: MatOption;
  @ViewChild('menuSelectedZones', { static: false }) private menuSelectedZones: MatOption;

  showMobileMenu: boolean = false;

  isMobile: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;

  constructor(
    public menuItems: MenuItems,
    private sidebarService: SidebarService,
    private router: Router,
    private facadeService: FacadeService,
    private filterService: FilterService,
    private signalRNotificationService: SignalRNotificationService,
    private mapMarkersService: MapMarkersService,
    private deviceDetectorService: DeviceDetectorService,
    private refreshNotificationCountService: RefreshNotificationCountService
  ) {
    if (this.deviceDetectorService.isDesktop()) {
      this.showMobileMenu = true;
    }

    this.sidebarService.currentStatus.subscribe(status => {
      this.newStatus = status;
    });

    this.filterService.currentStatus.subscribe(state => {
      this.state = state;
    });

    const loggedIn = this.facadeService.accountService.isLoggedIn;
    this.signalRNotificationService.refreshCount.subscribe(res => {
      if (res && loggedIn && this.currentState) {
        this.getUnReadCount();
      }
    });

    this.filterService.NotificationReadStatus.subscribe(state => {
      if (loggedIn && this.currentState) {
        this.getUnReadCount();
      }
    });

    router.events.subscribe((value) => {
      if ((value instanceof NavigationEnd) && (value.url == Routes.main || value.url == Routes.mainWithTypeAdd || value.url == '/')) {
        this.state['viewType'] = 'map';
        //this.clearFilter();
        // this.facadeService.authenticatedService.changeStatus(true);
      } else if (value instanceof NavigationEnd && value.url == Routes.tasks) {
        this.state['viewType'] = 'list';
        // this.clearFilter();
      } else if (value instanceof NavigationEnd && value.url == Routes.accessControl) {
        this.enableRoleSelect = true;
      } else {
        this.enableRoleSelect = false;
        this.state['viewType'] = '';
      }
    });

    this.isMobile = this.deviceDetectorService.isMobile();
    this.isTablet = this.deviceDetectorService.isTablet();
    this.isDesktop = this.deviceDetectorService.isDesktop();
  }

  ngOnInit() {
    const loggedIn = this.facadeService.accountService.isLoggedIn;
    if (loggedIn) {
      this.getUnReadCount();
      this.getAllNotifications();
    }

    this.facadeService.authenticatedService.currentStatus.subscribe(state => {
      this.currentState = state;
      // if (this.currentState && !this.teamsLoadedBefore) {
      //   this.listTeams();
      // }

      if (this.currentState && !this.restaurantsLoading) {
        this.listRestaurants();
      }

      if (this.currentState && !this.branchesLoadedBefore) {
        this.listBranches();
      }

      if (this.currentState && !this.zonesLoadedBefore) {
        this.listZones();
      }

      if (this.currentState) {
        this.getUnReadCount();
        this.getAllNotifications();
      }

    });

    this.facadeService.roleService.currentRole.subscribe(role => {
      this.role = role;
    });

    this.refreshNotificationCountService.count.subscribe((refresh: boolean) => {
      if (refresh) {
        this.unReadCount++;
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.clearFilter();
  }

  onToggle() {
    this.sidebarService.changeStatus(!this.newStatus);
  }

  /**
   * select role
   * 
   * 
   * 
   * @param event 
   * 
   * @returns type of role
   */
  onChangeType(event) {
    const value = event.target.value;
    this.facadeService.roleService.changeRole(value);
  }

  /**
   * create task
   * 
   * 
   */
  createTask() {
    if (this.deviceDetectorService.isMobile()) {
      this.showMobileMenu = false;
    }

    this.router.navigateByUrl('/app').then(() => {
      this.mapMarkersService.changeMarkers([], false);
      this.sidebarService.changeStatus(false);
      this.router.navigate(['app'], { queryParams: { openTask: "add" }, skipLocationChange: true });
    });
  }

  /**
   * list teams
   * 
   * 
   * @todo cache teams to be loaded one time
   */
  // listTeams() {
  //   this.teamsLoading = true;
  //   this.facadeService.teamsService.list().subscribe(teams => {
  //     this.teamsLoading = false;
  //     this.teamsLoadedBefore = true;
  //     this.teams = teams;
  //   });
  // }

  /**
   * list restaurants
   * 
   *
   */
  listRestaurants() {
    this.restaurantsLoading = true;
    if (!this.branchesLoadedBefore) {
      this.facadeService.restaurantService.list().subscribe(restaurants => {

        this.restaurantsLoading = false;
        this.restaurantsLoadedBefore = true;

        this.restaurants = restaurants;
      });
    } else {
      this.restaurantsLoading = false;
    }
  }

  /**
   * all branches
   * 
   * 
   */
  listBranches() {
    this.branchesLoading = true;
    if (!this.branchesLoadedBefore) {
      this.facadeService.branchService.list().subscribe(branches => {

        this.branchesLoading = false;
        this.branchesLoadedBefore = true;

        this.branches = branches;
        this.tempBranches = branches;
      });
    } else {
      this.branchesLoading = false;
    }
  }

  /**
   * all zones
   * 
   * 
   */
  listZones() {
    this.zonesLoading = true;
    if (!this.zonesLoadedBefore) {
      this.facadeService.geoFenceService.list().subscribe(zones => {

        this.zonesLoading = false;
        this.zonesLoadedBefore = true;

        this.zones = zones;
      });
    } else {
      this.zonesLoading = false;
    }
  }

  /**
   * select type 
   * 
   * 
   * @param event 
   */
  onSelectTasksTypeView(event: MatButtonToggleChange) {
    switch (event.value) {
      case 'list':
        this.filterService.changeStatus({ viewType: 'list' });
        break;

      default:
        this.filterService.changeStatus({ viewType: 'map' });
        break;
    }
  }

  /**
   * select date to filter map tasks
   * 
   * 
   * @param event 
   * @param type 
   */
  onSelectDate(event: any, type: string) {
    if (type == 'date') {
      this.filterService.changeStatus({ date: event.value });
      this.today = event.value;
    } else if (type == 'dateRange') {
      const range = { startDate: event.startDate, endDate: event.endDate };
      this.dateRange = range;
      this.filterService.changeStatus({ viewType: 'list', dateRange: range });
    }
  }

  /**
   * select branches depend on zones & rests
   * 
   * 
   * @param event 
   * @param selectType 
   */
  onChange(event: MatSelectionListChange, selectType: string) {
    const value = event.source._value;
    switch (selectType) {
      // case 'teams':
      //   let ids: number[] = [];

      //   if (value == 0) {
      //     this.teams.filter(team => {
      //       ids.push(team.id);
      //     });
      //   } else {
      //     ids.push(value);
      //   }

      //   this.selectedteams = ids;
      //   break;

      case 'zones':
        let zonesIds: any[] = [];
        zonesIds.push(...value);

        this.selectedZones = zonesIds;
        this.branches = this.branches.filter(branch => {
          return this.selectedZones.includes(branch.geoFenceId) && this.selectedRestuarants.includes(branch.restaurantId);
        });

        this.selectedBranches.filter(branch => {
          if (this.branches.findIndex(x => x.id == branch) >= 0) {
            return true;
          } else {
            return false;
          }
        });
        break;

      case 'restaurants':
        this.branches = this.tempBranches;

        let restaurantsIds: any[] = [];
        restaurantsIds.push(...value);

        this.selectedBranches = this.selectedRestuarants = restaurantsIds;
        this.branches = this.branches.filter(branch => {
          return this.selectedZones.includes(branch.geoFenceId) && this.selectedRestuarants.includes(branch.restaurantId);
        });

        this.selectedBranches = this.selectedBranches.filter(branch => {
          if (this.branches.findIndex(x => x.id == branch) >= 0) {
            return true;
          } else {
            return false;
          }
        });
        break;

      case 'branches':
        let branchesIds: any[] = [];
        branchesIds.push(...value);
        this.selectedBranches = branchesIds;
        break;


      default:
        break;
    }

    // if (this.state.viewType == 'map') {
    //   this.filterService.changeStatus({ viewType: 'map', date: this.today, teams: this.selectedteams });
    // } else {
    //   if (this.dateRange.startDate || this.dateRange.startDate) {
    //     this.filterService.changeStatus({ viewType: 'list', dateRange: this.dateRange, teams: this.selectedteams });
    //   } else {
    //     this.filterService.changeStatus({ viewType: 'list', teams: this.selectedteams });
    //   }
    // }
    // if (this.state.viewType == 'map') {
    //   this.filterService.changeStatus({
    //       viewType: 'map',
    //       date: this.filterService.currentStatusSnapshot.date,
    //       branchesIds: this.selectedBranches
    //     });
    // } else {

    //   if (!this.dateRange) {
    //     const range = { startDate: new Date(), endDate: new Date() };
    //     this.dateRange = range;
    //   }

    //   if (this.dateRange.startDate || this.dateRange.startDate) {
    //     this.filterService.changeStatus({ viewType: 'list', dateRange: this.dateRange, branchesIds: this.selectedBranches });
    //   } else {
    //     this.filterService.changeStatus({ viewType: 'list', branchesIds: this.selectedBranches });
    //   }
    // }
    this.filterService.changeStatus({ branchesIds: this.selectedBranches });
  }

  /**
   * default view 
   * 
   * 
   */
  setDefaultView() {
    this.sidebarService.changeStatus(false);
    this.state['viewType'] = 'list';
  }

  /**
   * notifications
   * 
   * 
   */
  getAllNotifications() {
    const body = {
      pageNumber: 0,
      pageSize: 20,
    }

    this.facadeService.notificationsService.listByPagination(body).subscribe((notifications: any) => {
      this.notifications = notifications.result;
    });
  }

  /**
   * notifications read count
   * 
   * 
   */
  getUnReadCount() {
    this.facadeService.notificationsService.unReadCount.subscribe((count: any) => {
      this.unReadCount = count;
    });
  }

  /**
   * notification page
   * 
   * 
   * @param notification 
   */
  goToPage(notification: NotificationVM) {
    if (notification.notificationType == '') {
      this.router.navigate([Routes.driversLoginRequests]);
    }
  }

  close() {
    this.sidebarService.changeStatus(false);
  }

  /**
   * reset all filters
   * 
   * 
   */
  clearFilter() {
    this.filterService.reset();
    this.dateValue = new Date();
    this.branches = this.tempBranches;

    this.selectedRestuarants = [];
    this.selectedBranches = [];
    this.selectedZones = [];

    if (this.state.viewType == 'map') {
      this.filterService.changeStatus({ viewType: 'map', date: new Date(), branchesIds: [] });
    } else {

      if (!this.dateRange) {
        const range = { startDate: new Date(), endDate: new Date() };
        this.dateRange = range;
      }

      if (this.dateRange.startDate || this.dateRange.startDate) {
        this.filterService.changeStatus({ viewType: 'list', dateRange: this.dateRange, branchesIds: [] });
      } else {
        this.filterService.changeStatus({ viewType: 'list', branchesIds: [] });
      }
    }
  }

  /**
 * select one value
 * 
 * 
 * @param key 
 */
  selectOne(key: string) {
    switch (key) {
      case 'branches':
        if (this.menuSelectedBranches.selected) {
          this.menuSelectedBranches.deselect();
          return false;
        }

        if (this.selectedBranches.length == this.branches.length) {
          this.menuSelectedBranches.select();
        }
        break;

      case 'restaurants':
        if (this.menuSelectedRestaurants.selected) {
          this.menuSelectedRestaurants.deselect();
          return false;
        }

        if (this.selectedRestuarants.length == this.restaurants.length) {
          this.menuSelectedRestaurants.select();
        }
        break;

      case 'zones':
        if (this.menuSelectedZones.selected) {
          this.menuSelectedZones.deselect();
          return false;
        }

        if (this.selectedZones.length == this.zones.length) {
          this.menuSelectedZones.select();
        }
        break;
    }
  }

  /**
   * select all / deselect all
   * 
   * 
   * @param type 
   */
  toggleAllSelection(type: string) {
    switch (type) {
      case 'branches':
        if (this.menuSelectedBranches.selected) {
          this.selectedBranches = [...this.branches.map(branch => branch.id), 0];
        } else {
          this.selectedBranches = [];
        }
        break;

      case 'restaurants':
        if (this.menuSelectedRestaurants.selected) {
          this.selectedRestuarants = [...this.restaurants.map(restaurant => restaurant.id), 0];
          this.branches = this.tempBranches;
          this.selectedZones.length == 0 ? this.branches = this.tempBranches : null;
        } else {
          this.selectedRestuarants = [];
          this.selectedZones.length == 0 ? this.branches = [] : null;
        }
        break;

      case 'zones':
        if (this.menuSelectedZones.selected) {
          this.selectedZones = [...this.zones.map(zone => zone.id), 0];
          this.selectedRestuarants.length == 0 ? this.branches = this.tempBranches : null;
        } else {
          this.selectedZones = [];
          this.selectedRestuarants.length == 0 ? this.branches = [] : null;
        }
        break;
    }
  }

  showMobileHeaderMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
