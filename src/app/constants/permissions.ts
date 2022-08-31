export class Permissions {
  public static listValues = [
    // task
    "ManagerPermissions.Task.CreateTask",
    "ManagerPermissions.Task.UpdateTask",
    "ManagerPermissions.Task.DeleteTask",
    "ManagerPermissions.Task.ReadUnassignedTask",
    "ManagerPermissions.Task.ChangeTaskStatus",

    // driver
    "ManagerPermissions.Agent.CreateAgent",
    "ManagerPermissions.Agent.ReadAgent",
    "ManagerPermissions.Agent.UpdateAgent",
    "ManagerPermissions.Agent.DeleteAgent",
    "ManagerPermissions.Agent.DeleteAllAgent",
    "ManagerPermissions.Agent.UpdateAllAgent",
    "ManagerPermissions.Agent.ChangeAgentPassword",
    "ManagerPermissions.Agent.ViewDriversLoginRequests",
    "ManagerPermissions.Agent.ExportAgent",
    "ManagerPermissions.Agent.ImportAgent",


    // customer
    "ManagerPermissions.Customer.CreateCustomer",
    "ManagerPermissions.Customer.UpdateCustomer",
    "ManagerPermissions.Customer.DeleteCustomer",
    "ManagerPermissions.Customer.ReadCustomer",
    "ManagerPermissions.Customer.ExportCustomer",
    "ManagerPermissions.Customer.ImportCustomer",


    // team
    "ManagerPermissions.Team.CreateTeam",
    "ManagerPermissions.Team.UpdateTeam",
    "ManagerPermissions.Team.DeleteTeam",
    "ManagerPermissions.Team.ReadTeam",
    "ManagerPermissions.Team.UpdateAllTeam",
    "ManagerPermissions.Team.DeleteAllTeam",
    "ManagerPermissions.Team.ReadMyTeam",

    // settings
    "ManagerPermissions.Settings.ReadAutoAllocation",
    "ManagerPermissions.Settings.UpdateAutoAllocation",
    "ManagerPermissions.Settings.UpdateGeneral",

    "ManagerPermissions.Settings.ReadGeofence",
    "ManagerPermissions.Settings.UpdateGeofence",
    "ManagerPermissions.Settings.AddGeofence",
    "ManagerPermissions.Settings.DeleteGeofence",
    "ManagerPermissions.Settings.ExportGeoFence",

    "ManagerPermissions.Settings.AddManager",
    "ManagerPermissions.Settings.ReadAllManagers",
    "ManagerPermissions.Settings.UpdateAllManager",
    "ManagerPermissions.Settings.ReadTeamManager",
    "ManagerPermissions.Settings.UpdateTeamManager",
    "ManagerPermissions.Settings.ChangeManagerPassword",
    "ManagerPermissions.Settings.AssignManager",
    "ManagerPermissions.Settings.UpdateAssignManager",
    "ManagerPermissions.Settings.DeleteAssignManager",

    "ManagerPermissions.Settings.ReadNotification",
    "ManagerPermissions.Settings.UpdateNotification",

    "ManagerPermissions.Settings.AddBranch",
    "ManagerPermissions.Settings.ReadBranch",
    "ManagerPermissions.Settings.DeleteBranch",
    "ManagerPermissions.Settings.UpdateBranch",
    "ManagerPermissions.Settings.BlockBranch",
    "ManagerPermissions.Settings.UnBlockBranch",

    "ManagerPermissions.Settings.AddRestaurant",
    "ManagerPermissions.Settings.ReadRestaurant",
    "ManagerPermissions.Settings.UpdateRestaurant",
    "ManagerPermissions.Settings.DeleteRestaurant",
    "ManagerPermissions.Settings.BlockRestaurant",
    "ManagerPermissions.Settings.UnBlockRestaurant",

    // dispatching managers
    'ManagerPermissions.Settings.AddManagerDispatching',
    'ManagerPermissions.Settings.UpdateManagerDispatching',
    'ManagerPermissions.Settings.ReadManagerDispatching',
    'ManagerPermissions.Settings.DeleteManagerDispatching',

    // reports
    "ManagerPermissions.Reports.ExportReport",
    "ManagerPermissions.Reports.ViewReport",
    "ManagerPermissions.Reports.ViewReport",
  ];
}
