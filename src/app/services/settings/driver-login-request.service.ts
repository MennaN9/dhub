import { Injectable } from "@angular/core";
import { HttpClientService } from "@dms/app/core/http-client/http-client.service";
import { DriverLoginRequestStatus } from "../../enums/driver-login-request-status.enum";
import { DriverLoginRequestLogin } from "../../models/settings/driver-login-request-login";
import { DriverLoginRequest } from "../../models/settings/driver-login-request";

const endpoint = "DriverLoginRequest";

@Injectable({
  providedIn: "root",
})
export class DriverLoginRequestService {
  constructor(private http: HttpClientService) {}
  /**
   *
   *Get all records of DriverLoginRequest
   * */
  list() {
    return this.http.get<DriverLoginRequest[]>(`${endpoint}/GetAll`);
  }
  /**
   * DriverLoginRequest Login endpoint
   * @param model
   */
  login(model: DriverLoginRequestLogin) {
    return this.http.post<boolean>(model, `${endpoint}/Login`);
  }

   /**
   *
   *Get all records of DriverLoginRequest
   * */
  listByPagination(body) {
    return this.http.get<DriverLoginRequest[]>(`${endpoint}/GetAllByPagination`, body);
  }




  /**
   * DriverLoginRequest approve reject pending endpoint
   * @param id
   * @param status
   */
  changeStatus(id: number, status: DriverLoginRequestStatus, reason) {
    if (reason == null)
      return this.http.get<boolean>(
        `${endpoint}/ChangeStatus?id=${id}&status=${status}&reason=`
      );
    else
      return this.http.get<boolean>(
        `${endpoint}/ChangeStatus?id=${id}&status=${status}&reason=${reason}`
      );
  }



  /**
   * delete driver
   *
   *
   * @param driverId
   */
  delete(loginrequestId: number) {
    return this.http.delete(`${endpoint}/Delete/${loginrequestId}`);
  }
}
