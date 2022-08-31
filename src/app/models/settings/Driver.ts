/**
 * Driver interface
 *
 *
 * @interface Driver
 */
export interface Driver {
  id?: number;
  imageUrl?: string;
  tags?: string;
  transportDescription?: string;
  licensePlate?: string;
  color?: string;
  role: string;
  teamId: number;
  teamName?: string;
  agentTypeId?: number;
  agentTypeName?: string;
  countryId?: number;
  countryName?: string;
  countryCode?: string;
  transportTypeId?: number;
  transportTypeName?: string;
  userId?: string;
  username?: string;
  email?: number;
  firstName?: string;
  phoneNumber?: string;
  lastName?: string;
  agentStatusName?: string;
  agentStatusId?:number;
  reason?:string;
  deviceType?:string;
  version?:string;
  latitude?:string;
  longitude?:string;
  driverAvgRate?: number;
  allPickupGeoFences?: boolean;
  allDeliveryGeoFences?: boolean;
  formFile: any;


  driverDeliveryGeoFences?: DriverGeoFences[];
  driverPickUpGeoFences?:DriverGeoFences[];
}




/**
 * Driver GeoFences interface
 *
 *
 * @interface DriverGeoFences
 */
export interface DriverGeoFences {
id:number;
driverId:number;
geoFenceId:number;
geoFenceName:string;
}



/**
 * Driver Working Hours Report interface
 *
 *
 * @interface DriverWorkingHourReport
 */
export interface DriverWorkingHourReport {
  driverId:number;
  driverName:string;
  dayOfMonth:string;
  totalHours:string;
  }
