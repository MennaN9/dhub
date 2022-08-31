/**
 * Address interface
 *
 *
 * @interface Address
 */
export interface Address {
  index?: number;
  opened?: boolean;
  paci?: string;
  governorate?: string;
  area?: string;
  block?: string;
  street?: string;
  building?: string;
  floor?: string;
  flat?: string;
  fullAddress?: string;
  filterArea?: string;
  filterBlock?: string;
  filterStreet?: string;
}

/**
 * Address Street interface
 *
 *
 * @interface AddressStreet
 */
export interface AddressStreet {
  govId?: string;
  areaId?: string;
  blockName?: string;
}

export interface Option {
  id: number,
  name: string
}


export interface AddressResult {
  address?: string;
  latitude?: string,
  longtiude: string;
}
