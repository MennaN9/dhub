import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AddressStreet, Address } from '@dms/models/settings/Address';

export interface Option {
  name: number;
  id: string;
}

export interface Area {
  areaId: number;
  areaName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private http: HttpClientService) { }

  /**
   * get governorates
   *
   *
   * @param id
   */
  get governorates() {
    return this.http.get(`Address/governorates`);
  }

  /**
   * get areas
   *
   *
   * @param id
   */
  get areas() {
    return this.http.get(`Address/GetAllAreas`);
  }

  areasByGovernorate(governorate: string) {
    return this.http.get(`Address/governorates/${governorate}/areas`);
  }

  /**
   * get blocks via area id
   *
   *
   * @param area
   */
  getBlocksByArea(area: string) {
    return this.http.get(`Address/get-blocks-from-paci?areaId=${area}`);
  }

  /**
   * get streets via governates / area / block name
   *
   *
   * @param id
   */
  getStreetsByBlock(body: AddressStreet) {
    return this.http.get(`Address/get-streets-from-paci`, body);
  }

  /**
   * address using google or paci
   *
   *
   * @param id
   */
  getAddress(body: Address) {
    return this.http.get(`Address/search-by-components`, body);
  }

  /**
   * address using paci
   *
   *
   * @param id
   */
  getAddressViaPACI(paciNumber: number) {
    return this.http.get(`Address/paci`, { paciNumber: paciNumber });
  }
}
