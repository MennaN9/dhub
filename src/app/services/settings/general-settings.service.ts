import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {

  private static readonly endpoint = 'Settings';
  constructor(private http: HttpClientService) { }

  /**
   * 
   * @param id 
   */
  settingsByGroupId(id: number) {
    return this.http.get(`${GeneralSettingsService.endpoint}/GetSettingByGroupId?GroupId=${id}`);
  }

  /**
   * update settings
   * 
   * 
   * @param model 
   */
  updateSettings(model: object) {
    return this.http.post(model, `${GeneralSettingsService.endpoint}/UpdateRange`);
  }

  getAutoAllocationMethods() {
    return this.http.get(`${GeneralSettingsService.endpoint}/GetAutoAllocationMethod`);
  }
}
