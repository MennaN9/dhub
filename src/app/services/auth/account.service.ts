import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { UserManagerResult, LoginResult } from '@dms/app/models/account/accountResult';
import { AuthConstants } from '@dms/app/constants/auth';
import { Observable } from 'rxjs';
import { AuthenticatedService } from './../state-management/authenticated.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  constructor(private http: HttpClientService, private authenticatedService: AuthenticatedService) {
  }

  private readonly endPoint: string = 'Account';

  /**
   * login
   *
   *
   * @param body
   */
  login(body): Observable<LoginResult> {
    return this.http.post<LoginResult>(body, `${this.endPoint}/Login`)
      .pipe(
        tap(result => this.setUser(result)),
        tap(() => this.authenticatedService.changeStatus(true)));
  }

  /**
   * forget password
   * 
   * 
   * @param body 
   */
  forgotPassword(body): Observable<UserManagerResult> {
    return this.http.post(body, `${this.endPoint}/ForgotPassword`);
  }


  /**
   * Rest token
   * 
   * 
   * @param body 
   */
  checkResetToken(body): Observable<UserManagerResult> {
    return this.http.post(body, `${this.endPoint}/CheckResetToken`);
  }

  /**
   * reset password
   * 
   * 
   * @param body 
   */
  resetPassword(body): Observable<UserManagerResult> {
    return this.http.post(body, `${this.endPoint}/ResetPassword`);
  }

  /**
   * set user 
   * 
   * @param user 
   */
  private setUser(res: LoginResult): boolean {
    if (res && res.user && res.tokenResponse) {
      localStorage.setItem(AuthConstants.UserKey, JSON.stringify(res.user));
      localStorage.setItem(AuthConstants.TokenKey, JSON.stringify(res.tokenResponse));
      return true;
    }
    return false;
  }

  /**
   * update displayed name
   * 
   *  
   */
  setUserName(name: string) {
    let user = this.user;
    user.fullName = name;

    localStorage.setItem(AuthConstants.UserKey, JSON.stringify(user));
    window.location.reload();
  }

  /**
   * get user data
   * 
   * 
   */
  get user() {
    if (localStorage.getItem(AuthConstants.UserKey) !== null) {
      return JSON.parse(localStorage.getItem(AuthConstants.UserKey));
    }
  }

  /**
   * check if Tenant role
   * 
   * 
   */
  get isTenant(): boolean {
    if (localStorage.getItem(AuthConstants.UserKey) !== null) {
      return JSON.parse(localStorage.getItem(AuthConstants.UserKey)).roleNames[0] === 'Tenant';
    }
  }

  /**
   * detecte if user logged in
   * 
   * 
   */
  get isLoggedIn(): boolean {
    if (localStorage.getItem(AuthConstants.UserKey) !== null) {
      return true;
    }
  }

  /**
   * logout
   * 
   * 
   */
  logout() {
    if (localStorage.getItem(AuthConstants.UserKey)) {
      localStorage.removeItem(AuthConstants.TokenKey);
      localStorage.removeItem(AuthConstants.UserKey);
      this.authenticatedService.changeStatus(false);
    }
  }

  logoutSession(userId: string) {
    return this.http.post({ userId: userId }, `${this.endPoint}/LogoutUser`);
  }

  /**
   * register
   * 
   * @param body 
   */
  register(body): Observable<UserManagerResult> {
    return this.http.post(body, `${this.endPoint}/Register`);
  }

  validateSession(email: string) {
    return this.http.get(`${this.endPoint}/ValidateLoginSession?Email=${email}`);
  }
}
