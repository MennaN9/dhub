import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static readonly endpoint = 'https://nominatim.openstreetmap.org/search?format=json';

  constructor(private http: HttpClient) { }

  /**
   * 
   * @param query 
   */
  searchQuery(query: string, lngCode: string = 'en'): Observable<any> {
    if (query.trim() !== '') {
      return this.http.get(SearchService.endpoint, { params: { q: query, 'accept- language': lngCode } });
    }
  }
}
