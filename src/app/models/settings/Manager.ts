/**
 * Manager interface
 *
 *
 * @interface Manager
 */
export interface Manager {
  id: number;
  teamId?: number;
  username?: string;
  email?: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  countryId?: number;
  roleId?: string;
  roleNames: string[];
  password?: string;
}

