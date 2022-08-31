import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Location } from '@dms/models/teams';

const endpoint = 'LocationAccuracy'

@Injectable({
  providedIn: 'root'
})
export class LoactionAccuracyService {

  constructor(private http: HttpClientService) { }

  /**
   * list all locations
   * 
   * 
   */
  list() {
    return this.http.get<Location[]>(`${endpoint}/GetAll`);
  }
}
