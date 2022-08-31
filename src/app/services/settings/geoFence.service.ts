import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { GeoFence } from '@dms/models/settings/GeoFence';

export interface GeoFenceLookUp {
  id?: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})


export class GeoFenceService {

  private static readonly endpoint = 'GeoFence';
  constructor(private http: HttpClientService) { }

  /**
   * get geoFence details
   *
   *
   * @param id
   */
  get(id: number) {
    return this.http.get<GeoFence>(`${GeoFenceService.endpoint}/Details/${id}`);
  }

  /**
   * list all geoFences
   *
   *
   */
  list() {
    return this.http.get<GeoFence[]>(`${GeoFenceService.endpoint}/GetAll`);
  }
  getAllGeoPance() {
    return this.http.get<GeoFenceLookUp[]>(`${GeoFenceService.endpoint}/GetAllPlatformLookup`);
  }

  /**
   * create new geoFence
   *
   *
   * @param model
   */
  create(model: GeoFence) {
    return this.http.post<GeoFence>(model, `${GeoFenceService.endpoint}/Create`);
  }

  /**
   * update geoFence
   *
   *
   * @param geoFenceId
   */
  update(model: GeoFence) {
    return this.http.put(model, `${GeoFenceService.endpoint}/Update`);
  }

  /**
   * delete geoFence
   *
   *
   * @param geoFenceId
   */
  delete(geoFenceId: number) {
    return this.http.delete(`${GeoFenceService.endpoint}/Delete/${geoFenceId}`);
  }

  /**
   * Export To Excel
   *
   */
  exportToExcel() {
    return this.http.getCustom<Blob>(`${GeoFenceService.endpoint}/ExportToExcel`, { responseType: 'blob' });
  }


  //getBlobThumbnail(): Observable<Blob> {
  //  const headers = new HttpHeaders({
  //    'Content-Type': 'application/json',
  //    'Accept': 'application/json'
  //  });
  //  return this.http.get<Blob>(`${GeoFenceService.endpoint}/api/GeoFence/ExportToExcel`, [headers]);
  //}

}
