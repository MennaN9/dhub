import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  static readonly endpoint = 'Country';

  constructor(private http: HttpClientService) { }


  /**
   * get country details
   *
   *
   * @param id
   */
  getcountry(id: number) {
    return this.http.get(`${CountryService.endpoint}/Details/${id}`);
  }

  /**
   * list all countries
   *
   *
   */
  list() {
    return this.http.get(`${CountryService.endpoint}/GetAll`);
  }

  /**
   * create new country
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${CountryService.endpoint}/Create`);
  }

  /**
   * update country
   *
   *
   * @param countryId
   */
  update(body: Object) {
    return this.http.put(body, `${CountryService.endpoint}`);
  }

  /**
   * delete country
   *
   *
   * @param countryId
   */
  delete(countryId: number) {
    return this.http.delete(`${CountryService.endpoint}/Delete/${countryId}`);
  }
}
