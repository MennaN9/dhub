import { Injectable } from '@angular/core';
import { Routes } from '@dms/app/constants/routes';
import { TranslateService } from '@ngx-translate/core';

export interface MenuItem {
  route: string;
  name: string;
  icon: string;
  permissions?: string[];
  children?: MenuItem[];
}

const SUPER_ADMIN = 'SuperAdmin';
@Injectable()
export class MenuItems {

  constructor(private translateService: TranslateService) { }

  menu: MenuItem[] = [
    {
      route: Routes.dashboard,
      name: this.translateService.instant('Dashboard'),
      icon: 'home',
      permissions: ["ShowDashoard"],
    },
    {
      route: Routes.superAdminDashboard,
      name: this.translateService.instant('Superadmin Dashboard'),
      icon: 'show_chart',
      permissions: [],
    },
    {
      route: Routes.drivers,
      name: this.translateService.instant('Drivers'),
      icon: 'drive_eta',
      permissions: ["ReadAgent"],
    },
    {
      route: Routes.customers,
      name: this.translateService.instant('Customers'),
      icon: 'people_outline',
      permissions: ["ReadCustomer"],
    },
    {
      route: Routes.reports,
      name: this.translateService.instant('Order Reports'),
      icon: 'playlist_add_check',
      permissions: ["ViewReport"],
    },
    {
      route: Routes.managerReports,
      name: this.translateService.instant('Manager Reports'),
      icon: 'playlist_add_check',
      permissions: ["ViewManagerReport"],
    },
    {
      route: Routes.driverReport,
      name: this.translateService.instant('Driver Working Hours Report'),
      icon: 'playlist_add_check',
      permissions: ['ReadDriverWorkingHours'],
    },
    {
      route: Routes.profile,
      name: this.translateService.instant('Profile'),
      icon: 'view_list',
      permissions: [],
    },
    {
      route: Routes.teams,
      name: this.translateService.instant('Teams'),
      icon: 'people',
      permissions: ["ReadMyTeam", "ReadTeam"],
    },
    {
      route: Routes.accessControl,
      name: this.translateService.instant('Access Control'),
      icon: 'accessibility',
      permissions: ["AddManager", "CreateAgent"],
    },
    {
      route: Routes.autoAllocation,
      name: this.translateService.instant('Auto Allocation'),
      icon: 'details',
      permissions: ["UpdateAutoAllocation"],
    },
    {
      route: Routes.geoFence,
      name: this.translateService.instant('Geo Fence'),
      icon: 'rounded_corner',
      permissions: [
        "ReadGeofence",
        "UpdateGeofence",
        "AddGeofence",
        "DeleteGeofence",
      ],
    },
    {
      route: Routes.managers,
      name: this.translateService.instant('Manager'),
      icon: 'important_devices',
      permissions: [
        "AddManager",
        "ReadAllManagers",
        "UpdateAllManager",
        "ReadTeamManager",
        "UpdateTeamManager",
      ],
    },
    {
      route: Routes.notificationsSettings,
      name: this.translateService.instant('Notifications Settings'),
      icon: 'notifications_active',
      permissions: ['UpdateNotificationSetting'],
    },
    // {
    //   route: Routes.notifications,
    //   name: this.translateService.instant('Notifications'),
    //   icon: 'notification_important',
    //   permissions: ['ReadNotification', 'UpdateNotification'],
    // },
    {
      route: Routes.logs,
      name: this.translateService.instant('Account logs'),
      icon: 'history',
      permissions: ['ViewAccountLogs'],
    },
    {
      route: Routes.restaurants,
      name: this.translateService.instant('Restaurants'),
      icon: 'store',
      permissions: [
        "AddRestaurant",
        "ReadRestaurant",
        "UpdateRestaurant",
        "DeleteRestaurant",
      ],
    },
    {
      route: Routes.dispatchingManagers,
      name: this.translateService.instant('Dispatching Managers'),
      icon: 'gavel',
      permissions: [
        "AddManagerDispatching",
        "UpdateManagerDispatching",
        "ReadManagerDispatching",
        "DeleteManagerDispatching",
      ],
    },
    {
      route: Routes.driversLoginRequests,
      name: this.translateService.instant('Drivers Login Requests'),
      icon: 'done_outline',
      permissions: ["ViewDriversLoginRequests"],
    },
    {
      route: Routes.driversRegistrationRequests,
      name: this.translateService.instant('Drivers Registration Requests'),
      icon: 'directions_car',
      permissions: [SUPER_ADMIN],
    },
    {
      route: Routes.generalSettings,
      name: this.translateService.instant('General Settings'),
      icon: 'perm_data_setting',
      permissions: ["UpdateGeneral"],
    },
    {
      route: Routes.businessRegistrationRequests,
      name: this.translateService.instant('Business Registration Requests'),
      icon: 'perm_data_setting',
      permissions: ['SuperAdmin'],
    },
    {
      route: Routes.termAndConditions,
      name: this.translateService.instant('Terms And Conditions'),
      icon: 'perm_data_setting',
      permissions: ["UpdateAgentTermsAndConditions"],
    },
    {
      route: Routes.bulkUpload,
      name: this.translateService.instant('Bulk Upload Shipment'),
      icon: 'backup',
      permissions: ['EnableShippmentBulkUpload', 'Tenant'],
    },
    {
      route: Routes.armadaBranches,
      name: this.translateService.instant('Armada Branches'),
      icon: 'backup',
      permissions: ['Armada'],
    },

  ];

  getMenuitem(): MenuItem[] {
    return this.menu;
  }
}
