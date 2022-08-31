import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AccountOrders, Dashboard, Result, TotalOrders, TotalRequests } from '@dms/app/models/super-admin-dashboard/dashboard';
import { Observable } from 'rxjs';

const endpoint = 'Dashboards'

@Injectable({
  providedIn: 'root'
})
export class SuperAdminDashboardService {

  constructor(private http: HttpClientService) { }

  getFirstDashbaordData(body: Dashboard): Observable<Result> {
    return this.http.post(body, `${endpoint}/Get`);
  }

  getOrdersByPagination(body: Dashboard): Observable<AccountOrders> {
    return this.http.post(body, `${endpoint}/GetOrdersByPagination`);
  }

  getBusinessAccountLookups(): Observable<{ item1: string, item2: string }[]> {
    return this.http.post({}, `${endpoint}/GetBusinessAccountLookups`);
  }

  getTotalPendingRequests(): Observable<TotalRequests> {
    return this.http.post({}, `${endpoint}/GetTotalPendingRequests`);
  }

  getTotalOrders(): Observable<TotalOrders> {
    return this.http.post({}, `${endpoint}/GetTotalOrders`);
  }
}
