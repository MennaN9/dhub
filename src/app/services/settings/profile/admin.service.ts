import { Injectable } from "@angular/core";
import { HttpClientService } from "@dms/app/core/http-client/http-client.service";
import { Admin } from "@dms/app/models/settings/profile/Admin";
import { Observable } from "rxjs";
import { AdminResult } from "@dms/app/models/settings/profile/AdminsResult";
import { changePassword } from "@dms/app/models/settings/profile/changePassword";
import { changePasswordResult } from "@dms/app/models/settings/profile/changePasswordResult";
import { ChangeLanguage } from "@dms/app/models/settings/profile/ChangeLanguage";
import { changeLanguageResult } from "@dms/app/models/settings/profile/changeLanguageResult";
import { DeactivateAccount } from "@dms/app/models/settings/profile/DeactivateAccount";
import { DeativationResult } from "@dms/app/models/settings/profile/DeativationResult";
import { Branch } from "../../../models/settings/branch";

const endpoint = 'User'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClientService) { }

  /**
   * get LoggedIn Admin  details
   *
   */
  GetCurrentAdmin(): Observable<Admin> {
    return this.http.get<Admin>(`${endpoint}/GetUserAdminInfo/`);
  }

  GetCurrentDefaultBranch(): Observable<Branch> {
    return this.http.get<Branch>(`${endpoint}/GetDefautBranch/`);
  }

  /**
   * Update User info
   * 
   * 
   * @param data 
   */
  UpdateUserInfo(data: Admin): Observable<AdminResult> {
    return this.http.postFormData(data, `${endpoint}/UpdateProfile/`);
  }

  /**
   * Change Passsword of User
   * 
   * 
   */
  changePassword(data: changePassword): Observable<changePasswordResult> {
    return this.http.post(data, `${endpoint}/ChangePassword/`);
  }

  /**
   * Change the User Language
   * 
   * 
   * @param data 
   */
  changeLanguage(data: ChangeLanguage): Observable<changeLanguageResult> {
    return this.http.post(data, `${endpoint}/UpdateLanguage/`);
  }


  changeDefaultBranch(data: any): Observable<changeLanguageResult> {
    return this.http.post(data, `${endpoint}/UpdateDefaultBranch/`);
  }

  /**
   * Deactivate Account
   * 
   * 
   * @param data 
   */
  deleteAccount(data: DeactivateAccount): Observable<DeativationResult> {
    return this.http.post(data, `${endpoint}/DeleteAccount/o`);
  }
}
