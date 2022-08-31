import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { Team } from '@dms/app/models/teams';

const endpoint = 'Teams'

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: HttpClientService) { }

  /**
   * get team details
   *
   *
   * @param id
   */
  getTeam(id: number) {
    return this.http.get(`${endpoint}/Details/${id}`);
  }

  /**
   * list all teams
   *
   *
   */
  list() {
    return this.http.get<Team[]>(`${endpoint}/GetAll`);
  }

  /**
   * list all teams by pagination
   *
   *
   */
  listByPagination(body: Object) {
    return this.http.post<Team[]>(body, `${endpoint}/GetAllByPagination`);
  }


  /**
   * create new team
   *
   *
   * @param body
   */
  create(body: Object) {
    return this.http.post(body, `${endpoint}/Create`);
  }

  /**
   * update team
   *
   *
   * @param body
   */
  update(body: Object) {
    return this.http.put(body, `${endpoint}`);
  }

  /**
   * delete team
   *
   *
   * @param teamId
   */
  delete(teamId: number) {
    return this.http.delete(`${endpoint}/Delete/${teamId}`);
  }
}
