import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { UserManagerResult, LoginResult } from '@dms/app/models/account/accountResult';
import { AuthConstants } from '@dms/app/constants/auth';
import { Observable } from 'rxjs';
import { AuthenticatedService } from '../state-management/authenticated.service';



@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly endPoint: string = 'User';

  constructor(private http: HttpClientService,
     private authenticatedService: AuthenticatedService) { }


 /**
   * change password
   *
   * @param body
   */
  changePassword(body) {
    return this.http.post(body, `${this.endPoint}/ChangePassword`);
  }


  GenerateAPIKey() {
    return this.http.get(`${this.endPoint}/GenerateAPIKey`);
  }

}
