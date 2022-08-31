import { GeoLocation } from "./GeoLocation";

/**
 * GeoFence interface
 *
 * @interface GeoFence
 */

export interface GeoFence {
  id?: number;
  name: string;
  description: string;
  drivers: number[];
  teams: any[];


  locations: GeoLocation[];
  updatedDate: string;
}



export interface polyCoordinates {
  latitude?: string;
  longitude?: string;
  pointIndex?: number;
}
