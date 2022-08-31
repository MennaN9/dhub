export interface DriverRequest {
    driverRegistrationId: number;
    file: string;
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    tags: string;
    transportDescription: string;
    licensePlate: string;
    color: string;
    roleName: string;
    teamId: number;
    agentTypeId: number;
    agentStatusId: number;
    transportTypeId: number;
    countryId: number;
    allPickupGeoFences: boolean;
    allDeliveryGeoFences: boolean;
    driverPickUpGeoFences: DriverPickUpGeoFence[];
    driverDeliveryGeoFences: DriverPickUpGeoFence[];
}

interface DriverPickUpGeoFence {
    id: number;
    driverId: number;
    geoFenceId: number;
    geoFenceName: string;
}

export interface HistoricalAuditor {
    firstName: string;
    fullName: string;
    lastName?: any;
    userId: string;
}