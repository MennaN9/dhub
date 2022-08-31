
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'teams',
    loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule),
  },
  {
    path: 'access-control',
    loadChildren: () => import('./access-control/access-control.module').then(m => m.AccessControlModule),
  },
  {
    path: 'auto-allocation',
    loadChildren: () => import('./auto-allocation/auto-allocation.module').then(m => m.AutoAllocationModule),
  },
  {
    path: 'geo-fence',
    loadChildren: () => import('./geo-fence/geo-fence.module').then(m => m.GeoFenceModule),
  },
  {
    path: 'drivers',
    loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule),
  },
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
  },
  {
    path: 'notifications-settings',
    loadChildren: () => import('./notifications-settings/notifications-settings.module').then(m => m.NotificationsSettingsModule),
  },
  {
    path: 'logs',
    loadChildren: () => import('./account-logs/account-logs.module').then(m => m.AccountLogsModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'restaurants',
    loadChildren: () => import('./restaurants/restaurants.module').then(m => m.RestaurantsModule)
  },
  {
    path: 'dispatching-managers',
    loadChildren: () => import('./dispatching-managers/dispatching-managers.module').then(m => m.DispatchingManagersModule)
  },
  {
    path: 'drivers-login-requests',
    loadChildren: () => import('./drivers-login-requests/drivers-login-requests.module').then(m => m.DriversLoginRequestsModule)
  },
  {
    path: 'drivers-registration-requests',
    loadChildren: () => import('./drivers-registration-requests/drivers-registration-requests.module').then(m => m.DriversRegistrationRequestsModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'manager-reports',
    loadChildren: () => import('./manager-reports/manger-reports.module').then(m => m.ManagerReportsModule)
  },
  {
    path: 'driver-reports',
    loadChildren: () => import('./driver-report/driver-report.module').then(m => m.DriverReportModule)
  },
  {
    path: 'general-settings',
    loadChildren: () => import('./general-settings/general-settings.module').then(m => m.GeneralSettingsModule)
  },
  {
    path: 'business-registration-requests',
    loadChildren: () => import('./business-registration-requests/business-registration-requests.module').then(m => m.BusinessRegistrationRequestsModule)
  },
  // {
  //   path: 'terms-and-conditions',
  //   loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule)
  // },
  {
    path: 'bulk-upload',
    loadChildren: () => import('./bulk-upload-shipment-details/bulk-upload-shipment-details.module').then(m => m.BulkUploadShipmentDetailsModule)
  },
  {
    path: 'armada-branches',
    loadChildren: () => import('./armada-braches/armada-braches.module').then(m => m.ArmadaBrachesModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
