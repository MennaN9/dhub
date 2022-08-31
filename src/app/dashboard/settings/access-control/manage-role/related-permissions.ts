import { Injectable } from "@angular/core";
import { NgxPermissionsService } from "ngx-permissions";

const READ_AGENT_PERMISSION: string = 'ReadAgent';
const READ_PLATFORM_AGENT_PERMISSION: string = 'ReadPlatformAgent';


@Injectable({
    providedIn: "root",
})
export class Permissions {

    constructor(private permissionsService: NgxPermissionsService) {
    }

    relatedPermissions(permissionToCheck: string): string[] {
        let permissions = [];
        switch (permissionToCheck) {
            case 'ManagerPermissions.Team.CreateTeam':
                permissions = [
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.CreateTeam',
                    'ManagerPermissions.Team.ReadMyTeam'
                ];
                break;

            case 'ManagerPermissions.Task.CreateTask':
                permissions = [
                    'ManagerPermissions.Task.CreateTask',
                    'ManagerPermissions.Task.ReadUnassignedTask',
                    'ManagerPermissions.Customer.CreateCustomer',
                    'ManagerPermissions.Customer.ReadCustomer',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Task.UpdateTask':
                permissions = [
                    'ManagerPermissions.Task.UpdateTask',
                    'ManagerPermissions.Task.ReadUnassignedTask',
                    'ManagerPermissions.Customer.CreateCustomer',
                    'ManagerPermissions.Customer.ReadCustomer',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Agent.CreateAgent':
                permissions = [
                    'ManagerPermissions.Agent.CreateAgent',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    'ManagerPermissions.Roles.ReadAllRoles',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Agent.UpdateAgent':
                permissions = [
                    'ManagerPermissions.Agent.UpdateAgent',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Agent.DeleteAgent':
                permissions = [
                    'ManagerPermissions.Agent.DeleteAgent',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Agent.ChangeAgentPassword':
                permissions = [
                    'ManagerPermissions.Agent.ChangeAgentPassword',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Settings.AddGeofence':
                permissions = [
                    'ManagerPermissions.Settings.AddGeofence',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Settings.UpdateGeofence':
                permissions = [
                    'ManagerPermissions.Settings.UpdateGeofence',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Team.ReadTeam',
                    'ManagerPermissions.Team.ReadMyTeam',
                    this.whichDriversPermissionToUse()
                ];
                break;

            case 'ManagerPermissions.Settings.AddBranch':
                permissions = [
                    'ManagerPermissions.Settings.AddBranch',
                    'ManagerPermissions.Settings.ReadBranch',
                    'ManagerPermissions.Settings.ReadRestaurant',
                ];
                break;

            case 'ManagerPermissions.Settings.UpdateBranch':
                permissions = [
                    'ManagerPermissions.Settings.UpdateBranch',
                    'ManagerPermissions.Settings.ReadBranch',
                    'ManagerPermissions.Settings.ReadRestaurant',
                ];
                break;

            case 'ManagerPermissions.Settings.AddRestaurant':
                permissions = [
                    'ManagerPermissions.Settings.AddRestaurant',
                    'ManagerPermissions.Settings.ReadRestaurant',
                ];
                break;

            case 'ManagerPermissions.Settings.UpdateRestaurant':
                permissions = [
                    'ManagerPermissions.Settings.UpdateRestaurant',
                    'ManagerPermissions.Settings.ReadRestaurant',
                ];
                break;

            case 'ManagerPermissions.Settings.AddManagerDispatching':
                permissions = [
                    'ManagerPermissions.Settings.AddManagerDispatching',
                    'ManagerPermissions.Settings.ReadRestaurant',
                    'ManagerPermissions.Settings.ReadBranch',
                    'ManagerPermissions.Settings.UpdateManagerDispatching',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Settings.DeleteManagerDispatching',
                ];
                break;

            case 'ManagerPermissions.Settings.UpdateManagerDispatching':
                permissions = [
                    'ManagerPermissions.Settings.UpdateManagerDispatching',
                    'ManagerPermissions.Settings.ReadRestaurant',
                    'ManagerPermissions.Settings.ReadBranch',
                    'ManagerPermissions.Settings.ReadManagerDispatching',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Settings.DeleteManagerDispatching',
                ];
                break;

            case 'ManagerPermissions.Settings.DeleteManagerDispatching':
                permissions = [
                    'ManagerPermissions.Settings.UpdateManagerDispatching',
                    'ManagerPermissions.Settings.ReadRestaurant',
                    'ManagerPermissions.Settings.ReadBranch',
                    'ManagerPermissions.Settings.ReadManagerDispatching',
                    'ManagerPermissions.Settings.ReadGeofence',
                    'ManagerPermissions.Settings.DeleteManagerDispatching',
                ];
                break;

            case 'ManagerPermissions.Settings.AddManager':
                permissions = [
                    'ManagerPermissions.Settings.ReadTeamManager',
                    'ManagerPermissions.Team.ReadMyTeam',
                    'ManagerPermissions.Settings.ReadAllManagers',
                    'ManagerPermissions.Roles.ReadAllRoles'
                ];
                break;

            case 'ManagerPermissions.Settings.ReadAllManagers':
                permissions = [
                    'ManagerPermissions.Settings.ReadTeamManager',
                ];
                break;

            case 'ManagerPermissions.Settings.ReadAllManagers':
                permissions = [
                    'ManagerPermissions.Settings.ReadTeamManager',
                ];
                break;

            default:
                break;
        }
        return permissions;
    }

    private whichDriversPermissionToUse(): string {
        if (this.permissionsService.getPermission(READ_AGENT_PERMISSION)) {
            return READ_AGENT_PERMISSION;
        } else if (this.permissionsService.getPermission(READ_PLATFORM_AGENT_PERMISSION)) {
            return READ_PLATFORM_AGENT_PERMISSION;
        }
    }
}

