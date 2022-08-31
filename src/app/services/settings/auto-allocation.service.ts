import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AutoAllocation } from '@dms/app/models/settings/AutoAllocation';

const endpoint = 'Settings';

@Injectable({
  providedIn: 'root'
})
export class AutoAllocationService {
  constructor(private http: HttpClientService) { }


  /**
   * get Settings details
   *
   *
   * @param id
   */
  getSettings(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * settings via group
   * 
   * 
   * @param id 
   */
  settingsByGroupId(id: number) {
    return this.http.get(`${endpoint}/GetSettingByGroupId?GroupId=${id}`);
  }

  /**
   * list all Settings
   *
   *
   */
  list() {
    return this.http.get(`${endpoint}/GetAll`);
  }

  /**
   * get Settings details bt key
   *
   */
  getSettingsByKey(key) {
    return this.http.get(`${endpoint}/GetByKey/${key}`);
  }

  /**
   * create new Settings
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update Settings
   *
   *
   * @param transportypeId
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete Settings
   *
   *
   * @param settingsId
   */
  delete(settingsId: number) {
    return this.http.delete(`${endpoint}/Delete/${settingsId}`);
  }

  /**
   * update bluck Settings
   * 
   * 
   * @param settings 
   */
  updateRange(settings: AutoAllocation[]) {
    return this.http.post(settings, `${endpoint}/UpdateRange`);
  }
}
