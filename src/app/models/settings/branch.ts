/**
 * Branch interface
 *
 * @interface Branch
 */
export interface Branch {
  id?: number;
  name?: string;
  phone?: string;
  restaurantId?: number;
  geoFenceId?: number;
  address?: string;
  latitude?: string;
  longitude?: string;
  managerId?: number;
  isActive?: boolean;
}
