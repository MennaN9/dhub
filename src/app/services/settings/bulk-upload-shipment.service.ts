import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class BulkUploadShipmentService {

  static readonly endpoint = 'ShippmentDetails';

  constructor(private http: HttpClientService) { }

  getFile(id: number) {
    return this.http.get(`${BulkUploadShipmentService.endpoint}/Details/${id}`);
  }

  list(body: object) {
    return this.http.get(`${BulkUploadShipmentService.endpoint}/GetAllByPagination`, body);
  }

  create(file: File, fileName: string) {
    const form = {
      file: file
    }
    return this.http.postFormDataCustome(`${BulkUploadShipmentService.endpoint}/Create`, form, { responseType: 'blob' });
  }

  delete(countryId: number) {
    return this.http.delete(`${BulkUploadShipmentService.endpoint}/Delete/${countryId}`);
  }

}
