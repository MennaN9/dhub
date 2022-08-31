import { Country } from "./Country";
import { Address } from '@dms/models/settings/Address';

/**
 * Customer interface
 *
 *
 * @interface Customer
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
  cid: string;
  phone: string;
  address: string;
  latitude: any;
  longitude: any;
  tags: string | any;
  countryId: number;
  country?: Country;
  location?: Address
}



