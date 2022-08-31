import { Injectable } from '@angular/core';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AgentType } from '../../models/settings/AgentType';

const endpoint = 'AgentType'

@Injectable({
  providedIn: 'root'
})
export class AgentTypeService {

  constructor(private http: HttpClientService) { }


  /**
   * get Agent Type details
   *
   *
   * @param id
   */
  getAgentType(id: number) {
    return this.http.get < AgentType>(`${endpoint}/Details/${id}`);
  }

  /**
   * list all Agent Types
   *
   *
   */
  list() {
    return this.http.get<AgentType[]>(`${endpoint}/GetAll`);
  }

  /**
   * create new Agent Type
   *
   *
   * @param body
   */
  create(body: AgentType) {
    return this.http.post < AgentType>(body, `${endpoint}/Create`);
  }

  /**
   * update Agent Type
   *
   *
   * @param agentTypeId
   */
  update(body: AgentType) {
    return this.http.put < AgentType>(body, `${endpoint}`);
  }

  /**
   * delete agentTypeId
   *
   *
   * @param agentTypeId
   */
  delete(agentTypeId: number) {
    return this.http.delete(`${endpoint}/Delete/${agentTypeId}`);
  }
}
