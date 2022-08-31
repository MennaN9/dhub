import { Injectable, Injector } from '@angular/core';
import { AccountService } from './auth/account.service';
import { RoleService } from './auth/role.service';
import { TeamsService } from './settings/teams.service';
import { LoactionAccuracyService } from './settings/loaction-accuracy.service';
import { AuthenticatedService } from './state-management/authenticated.service';
import { ManagerService } from './settings/manager.service';
import { ManagerAccessControlService } from './settings/access-control/manager-access-control.service';
import { AgentAccessControlService } from './settings/access-control/agent-access-control.service';
import { CountryService } from './settings/country.service';
import { AgentTypeService } from './settings/agent-type.service';
import { TransportTypeService } from './settings/transport-type.service';
import { DriverAccessControlService } from './settings/driver-access-control.service';
import { DriverService } from './settings/driver.service';
import { CustomerService } from './settings/customer.service';
import { MainTaskTypeService } from './main/tasks/main-task-type.service';
import { MainTaskService } from './main/tasks/main-task.service';
import { TaskTypeService } from './main/tasks/task-type.service';
import { SearchService } from './maps/search.service';
import { GeoFenceService } from './settings/geoFence.service';
import { AutoAllocationService } from './settings/auto-allocation.service';
import { TaskStatusService } from './main/tasks/task-status.service';
import { TaskService } from './main/tasks/task.service';
import { RestaurantService } from './settings/restaurant.service';
import { BranchService } from './settings/branch.service';
import { DispatchingManagersService } from './settings/dispatching-managers.service';
import { IpInfoService } from './info/ip-info.service';
import { UserService } from './auth/user.service';
import { DriverLoginRequestService } from './settings/driver-login-request.service';
import { AdminService } from './settings/profile/admin.service';
import { AccountLogService } from './settings/account-log.service';
import { NotificationsService } from './settings/notifications.service';
import { LanguageService } from './translator/language.service';
import { GeneralSettingsService } from './settings/general-settings.service';
import { AddressService } from './settings/address.service';
import { DriverTermsAndConditionsService } from './settings/driver-terms-and-conditions.service';
import { DriverWorkingHourTrackingService } from './settings/driver-working-hour.service';
import { SuperAdminDashboardService } from './info/super-admin-dashboard.service';
import { TenantConfigurationService } from './tanent/tenant-configuration.service';
import { ArmadaBranchesService } from './settings/armada-branches.service';

@Injectable({
  providedIn: 'root'
})

export class FacadeService {

  private _armadaBranchesService: ArmadaBranchesService;

  constructor(private inject: Injector) { }

  get accountService(): AccountService {
    return this.inject.get(AccountService)
  }

  get roleService(): RoleService {
    return this.inject.get(RoleService);;
  }

  get languageService(): LanguageService {
    return this.inject.get(LanguageService);
  }

  get teamsService(): TeamsService {
    return this.inject.get(TeamsService);
  }

  get agentAccessControlService(): AgentAccessControlService {
    return this.inject.get(AgentAccessControlService);;
  }

  get managerAccessControlService(): ManagerAccessControlService {
    return this.inject.get(ManagerAccessControlService);
  }

  get loactionAccuracyService(): LoactionAccuracyService {
    return this.inject.get(LoactionAccuracyService);
  }

  get authenticatedService(): AuthenticatedService {
    return this.inject.get(AuthenticatedService);
  }

  get managerService(): ManagerService {
    return this.inject.get(ManagerService);
  }

  get dispatchingManagersService(): DispatchingManagersService {
    return this.inject.get(DispatchingManagersService);
  }

  get customerService(): CustomerService {
    return this.inject.get(CustomerService);
  }

  get driverService(): DriverService {
    return this.inject.get(DriverService);
  }

  get countryService(): CountryService {
    return this.inject.get(CountryService);
  }

  get agentTypeService(): AgentTypeService {
    return this.inject.get(AgentTypeService);
  }

  get TransportTypeService(): TransportTypeService {
    return this.inject.get(TransportTypeService);
  }

  get DriverAccessControlService(): DriverAccessControlService {
    return this.inject.get(DriverAccessControlService);
  }

  get ManagerAccessControlService(): ManagerAccessControlService {
    return this.inject.get(ManagerAccessControlService);
  }

  get mainTaskTypeService(): MainTaskTypeService {
    return this.inject.get(MainTaskTypeService);
  }

  get mainTaskService(): MainTaskService {
    return this.inject.get(MainTaskService);
  }

  get taskTypeService(): TaskTypeService {
    return this.inject.get(TaskTypeService);
  }

  get mapsService(): SearchService {
    return this.inject.get(SearchService);
  }

  get geoFenceService(): GeoFenceService {
    return this.inject.get(GeoFenceService);
  }
  get TenantConfigurationService(): TenantConfigurationService {
    return this.inject.get(TenantConfigurationService);
  }


  get autoAllocationService(): AutoAllocationService {
    return this.inject.get(AutoAllocationService);
  }

  get taskStatusService(): TaskStatusService {
    return this.inject.get(TaskStatusService);
  }

  get taskService(): TaskService {
    return this.inject.get(TaskService);
  }

  get restaurantService(): RestaurantService {
    return this.inject.get(RestaurantService);
  }

  get branchService(): BranchService {
    return this.inject.get(BranchService);
  }

  get ipInfoService(): IpInfoService {
    return this.inject.get(IpInfoService)
  }

  get userService(): UserService {
    return this.inject.get(UserService);
  }

  get driverLoginRequestService(): DriverLoginRequestService {
    return this.inject.get(DriverLoginRequestService);
  }

  get adminService(): AdminService {
    return this.inject.get(AdminService);
  }

  get accountLogService(): AccountLogService {
    return this.inject.get(AccountLogService);
  }

  get notificationsService(): NotificationsService {
    return this.inject.get(NotificationsService);
  }

  get generalSettingsService(): GeneralSettingsService {
    return this.inject.get(GeneralSettingsService);
  }

  get addressService(): AddressService {
    return this.inject.get(AddressService);
  }

  get driverWorkingHourTrackingService(): DriverWorkingHourTrackingService {
    return this.inject.get(DriverWorkingHourTrackingService)
  }

  get driverTermsAndConditionsService(): DriverTermsAndConditionsService {
    return this.inject.get(DriverTermsAndConditionsService);
  }

  get superAdminDashboardService(): SuperAdminDashboardService {
    return this.inject.get(SuperAdminDashboardService)
  }

  get armadaBranchesService(): ArmadaBranchesService {
    return this.inject.get(ArmadaBranchesService)
  }
}
