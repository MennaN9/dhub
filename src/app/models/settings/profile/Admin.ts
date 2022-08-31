/**
 * Admin interface
 *
 * 
 * @interface Admin
 */
export interface Admin {
  companyName: string;
  companyAddress: string;
  displayImage: number;
  id: string;
  email: string;
  phone: string;
  countryId: number;
  firstName: string;
  residentCountryId: number;
  dashBoardLanguage: string;
  trackingPanelLanguage: string;
  branchId: number;
  isManager: boolean;
  bankLogoURL: string;
}
