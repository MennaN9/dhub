/**
 * Driver service
 *
 * @constant endpoint
 * @class DriverService
 */
import { Injectable } from "@angular/core";
import { HttpClientService } from "@dms/app/core/http-client/http-client.service";
import { Driver } from "../../models/settings/Driver";
import { DriverBulkBlock } from "../../models/settings/DriverBulkBlock";
import { BulkChangeDriversType } from "../../models/settings/bulkChangeDriversType";

const endpoint = "Driver";

@Injectable({
  providedIn: "root",
})
export class DriverService {
  /**
   *
   * @param http
   */
  constructor(private http: HttpClientService) { }

  /**
   * get driver details
   *
   *
   * @param id
   */
  getdriver(id: number) {
    return this.http.get<Driver>(`${endpoint}/Details/${id}`);
  }

  /**
   * list all drivers
   *
   *
   */
  list() {
    return this.http.get<Driver[]>(`${endpoint}/GetAll`);
  }

  /**
   * list all drivers by pagination
   *
   *
   * @param body
   */
  listByPagination(body: object) {
    return this.http.post(body, `${endpoint}/GetAllByPagination`);
  }

  /**
   * list all platform drivers by pagination
   *
   *
   * @param body
   */
  listPlatformByPagination(body: object) {
    return this.http.post(body, `${endpoint}/GetPlatformByPagination`);
  }

  /**
   * Get Driver Login Tracking
   *
   *
   * @param body
   */
  driverLoginTracking(body: object) {
    return this.http.post(body, `${endpoint}/GetDriverLoginTracking`);
  }

  /**
   * block driver
   *
   *
   * @param model
   */
  block(model: any) {
    return this.http.put(
      null,
      `${endpoint}/BlockDriver?id=${model.driverId}&reason=${model.reason}`
    );
  }

  /**
   * create new driver
   *
   *
   * @param body
   */
  create(body: Driver) {
    return this.http.postFormData(body, `${endpoint}/Create`);
  }


  SetOnDuty(body: object) {
    return this.http.post(body, `${endpoint}/SetOnDuty`);
  }


  /**
   * update driver
   *
   *
   * @param driverId
   */
  update(body: Driver) {
    return this.http.putFormData(body, `${endpoint}/Update`);
  }

  /**
   * delete driver
   *
   *
   * @param driverId
   */
  delete(driverId: number) {
    return this.http.delete(`${endpoint}/Delete/${driverId}`);
  }

  /**
   * driver tags
   *
   *
   */
  listTags() {
    return this.http.get(`${endpoint}/GetTags`);
  }

  /**
   * drivers
   *
   */
  get driversForAssignment() {
    return this.http.get(`${endpoint}/GetAllDriversForAssignment`);
  }

  /**
   * bullkDelete
   *
   */
  bullkDelete(drivers: Driver[]) {
    return this.http.post(drivers, `${endpoint}/BullkDelete`);
  }

  /**
   * bullkBlock
   *
   *
   * @param model
   */
  bullkBlock(model: DriverBulkBlock) {
    return this.http.put(model, `${endpoint}/BlockDrivers`);
  }

  UnbullkBlock(model: DriverBulkBlock) {
    return this.http.put(model, `${endpoint}/UnBlockDrivers`);
  }

  /**
   * change driver(s) type
   *
   *
   * @param model
   */
  bulkChangeDriversType(model: BulkChangeDriversType) {
    return this.http.post<void>(model, `${endpoint}/ChangeDriversType`);
  }

  /**
   * rate driver
   *
   *
   * @param model
   */
  rate(body: object) {
    return this.http.post<void>(body, 'DriverRate/Create');
  }

  /*
   * force driver logout
   *
   * @param driverId
   */
  forceLogout(driverId: number) {
    return this.http.get<Driver>(`${endpoint}/ForceLogout/${driverId}`);
  }

  /**
   * Export To Excel
   *
   */
  exportToExcel(body: any) {
    body.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.http.getCustom<Blob>(`${endpoint}/ExportToExcel`, {
      responseType: "blob",
    }, body);
  }


  /**
 * Export To Excel
 *
 */
  LoginTrackingexportToExcel(body) {
    body.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return this.http.postCustom<Blob>(`${endpoint}/ExportDriverLoginTrackingToExcel`, body, {
      responseType: "blob",
    });
  }


  get downloadTemplate() {
    //return this.http.get<Blob>(`Download/DownloadImportTemplate`, { name: 'Driver' });

    return this.http.getCustom<Blob>(
      "Download/DownloadImportTemplate?name=Driver",
      { responseType: "blob" }
    );
  }

  /**
   *  import from Excel
   *
   */
  importFromExcel(file: File, fileName: string) {
    var form = {
      file: file
    }

    return this.http.postFormDataCustome(`${endpoint}/AddFromExcelSheet`, form, { responseType: 'blob' });
  }




}
