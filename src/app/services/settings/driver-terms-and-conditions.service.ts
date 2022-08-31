import { Injectable } from '@angular/core';
import { HttpClientService } from '../../core/http-client/http-client.service';
import { TermsAndConditions } from '../../models/settings/terms-and-conditions';
import { Observable } from 'rxjs';

const endpoint = 'TermsAndConditions'

@Injectable({
  providedIn: 'root'
})
export class DriverTermsAndConditionsService {

  constructor(private http: HttpClientService) { }


  getDriverTermsAndConditions(): Observable<TermsAndConditions> {
    return this.http.get(`${endpoint}/GetDriverTermsAndConditions`);
  }


  updateDriverTermsAndConditions(terms:TermsAndConditions)  {
    return this.http.put(terms,`${endpoint}/UpdateDriverTermsAndConditions`);
  }


  dowenloadDriverTermsAndConditions() {
    return this.http.getCustom(`${endpoint}/DowenloadDriverTermsAndConditions`);
  }

}
