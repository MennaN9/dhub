import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Restaurant } from '@dms/models/settings/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private static readonly endpoint = 'Restaurant';
  constructor(private http: HttpClientService) { }

  /**
   * get restaurant details
   *
   *
   * @param id
   */
  get(id: number) {
    return this.http.get<Restaurant>(`${RestaurantService.endpoint}/Details/${id}`);
  }

  /**
   * list all restaurants
   *
   *
   */
  list() {
    return this.http.get<Restaurant[]>(`${RestaurantService.endpoint}/GetAll`);
  }

  /**
   * get restaurants using pagination
   *
   *
   * @param body
   */
  listByPagination(body: object) {
    return this.http.post(body, `${RestaurantService.endpoint}/GetAllByPagination`);
  }

  /**
   * create new restaurant
   *
   *
   * @param model
   */
  create(model: Restaurant) {
    return this.http.post<Restaurant>(model, `${RestaurantService.endpoint}/Create`);
  }

  /**
   * update restaurant
   *
   *
   * @param restaurantId
   */
  update(model: Restaurant) {
    return this.http.put(model, `${RestaurantService.endpoint}/Update`);
  }

  /**
   * delete restaurant
   *
   *
   * @param restaurantId
   */
  delete(restaurantId: number) {
    return this.http.delete(`${RestaurantService.endpoint}/Delete/${restaurantId}`);
  }

  /**
 * block restaurant
 *
 *
 * @param model
 */
  block(model) {
    return this.http.get(`${RestaurantService.endpoint}/SetActivate`, model);
  }
}
