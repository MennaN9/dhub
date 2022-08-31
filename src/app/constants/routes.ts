export class Routes {
  static readonly register = '/auth/register';
  static readonly Login = '/auth/login';
  static readonly forgotPassword = '/auth/forgotPassword';
  static readonly privacyPolicy = '/auth/privacy-policy';
  static readonly terms = '/auth/terms-of-service';
  static readonly tasks = '/tasks';

  static readonly geoFence = '/app/settings/geo-fence';
  static readonly addGeoFence = '/app/settings/geo-fence/add';
  static readonly main = '/app';
  static readonly mainWithTypeAdd = '/app?openTask=add';
  static readonly accessControl = '/app/settings/access-control';

  static readonly dashboard = '/app';
  // static readonly dashboard = '/tasks';

  static readonly profile = '/app/settings/profile';
  static readonly teams = '/app/settings/teams';
  static readonly autoAllocation = '/app/settings/auto-allocation';
  static readonly managers = '/app/settings/manager';
  static readonly notifications = '/app/settings/notifications';
  static readonly notificationsSettings = '/app/settings/notifications-settings';
  static readonly logs = '/app/settings/logs';
  static readonly customers = '/app/settings/customers';
  static readonly drivers = '/app/settings/drivers';
  static readonly restaurants = '/app/settings/restaurants';
  static readonly dispatchingManagers = '/app/settings/dispatching-managers';
  static readonly driversLoginRequests = '/app/settings/drivers-login-requests';
  static readonly driversRegistrationRequests = '/app/settings/drivers-registration-requests';
  static readonly driversRegistrationRequestsViewDetails = '/app/settings/drivers-registration-requests/view-details';
  static readonly reports = '/app/settings/reports';

  static readonly managerReports = '/app/settings/manager-reports';

  static readonly driverReport = '/app/settings/driver-reports';
  static readonly taskTracking = '/app/task-tracking';
  static readonly driverRating = '/rate/customer';
  static readonly generalSettings = '/app/settings/general-settings';

  static readonly businessRegistrationRequests = '/app/settings/business-registration-requests';
  static readonly businessRegistrationRequestsViewDetails = '/app/settings/business-registration-requests/view-details';
  static readonly deliveryConfiguration = '/app/settings/business-registration-requests/view-Delivery-configuration';
  static readonly termAndConditions = '/app/settings/terms-and-conditions';

  static readonly bulkUpload = '/app/settings/bulk-upload';
  static readonly superAdminDashboard = '/super-admin-dashboard';
  static readonly armadaBranches = '/app/settings/armada-branches';
}
