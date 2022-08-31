import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Customer } from '@dms/models/settings/Customer';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private static readonly endpoint = 'Customers';

  constructor(private http: HttpClientService) { }

  /**
   * get customer details
   *
   *
   * @param id
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http.get(`${CustomerService.endpoint}/Details/${id}`);
  }

  /**
   * list all customers
   *
   *
   */
  list() {
    return this.http.get(`${CustomerService.endpoint}/GetAll`);
  }

  /**
   * get customers using pagination
   *
   *
   * @param body
   */
  listByPagination(body: object) {
    return this.http.post(body, `${CustomerService.endpoint}/GetAllByPagination`);
  }

  /**
   * create new customer
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${CustomerService.endpoint}/Create`);
  }

  /**
   * update customer
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${CustomerService.endpoint}`);
  }

  /**
   * delete customer
   *
   *
   * @param customerId
   */
  delete(customerId: number) {
    return this.http.delete(`${CustomerService.endpoint}/Delete/${customerId}`);
  }


  /**
   * delete bulk customers
   *
   *
   * @param body
   */
  bulkDelete(body: Object) {
    return this.http.post(body, `${CustomerService.endpoint}/BulkDelete`);
  }


  /**
   * search in customers by name
   *
   *
   * @param name
   */
  getCustomersByName(name: string): Observable<Customer> {
    return this.http.get(`${CustomerService.endpoint}/GetByName/${name}`);
  }


  /**
 * search in customers by phone
 *
 *
 * @param name
 */
  getCustomersByPhone(phone: string): Observable<Customer> {
    return this.http.get(`${CustomerService.endpoint}/GetByPhone/${phone}`);
  }


  /**
   * Export To Excel 
   * 
   */
  exportToExcel(body: object) {
    return this.http.getCustom<Blob>(`${CustomerService.endpoint}/ExportToExcel`, { responseType: 'blob' }, body);
  }

  /**
   * download template
   * 
   */
  get downloadTemplate() {
    return this.http.getCustom<Blob>('Download/DownloadImportTemplate?name=Customer', { responseType: 'blob' });
  }

  /**
  *  import from Excel
  * 
  */
  importFromExcel(file: File, fileName: string) {
    var form = {
      file: file
    }
    return this.http.postFormDataCustome(`${CustomerService.endpoint}/AddFromExcelSheet`, form, { responseType: 'blob' });
  }
}
