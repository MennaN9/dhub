import { Injectable } from "@angular/core";
import { HttpClientService } from "@dms/app/core/http-client/http-client.service";
import { Branch } from "@dms/models/settings/branch";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BranchService {
  private static readonly endpoint = "Branch";
  constructor(private http: HttpClientService) { }

  /**
   * get branch details
   *
   *
   * @param id
   */
  get(id: number) {
    return this.http.get<Branch>(`${BranchService.endpoint}/Details/${id}`);
  }

  /**
   * list all branchs
   *
   *
   */
  list() {
    return this.http.get<Branch[]>(`${BranchService.endpoint}/GetAll`);
  }

  /**
   * get branchs using pagination
   *
   *
   * @param body
   */
  listByPagination(body: object) {
    return this.http.post(body, `${BranchService.endpoint}/GetAllByPagination`);
  }

  listByResturantPagination(body: object) {
    return this.http.post(
      body,
      `${BranchService.endpoint}/GetAllByResturantPagination`
    );
  }

  /**
   * create new branch
   *
   *
   * @param model
   */
  create(model: Branch) {
    return this.http.post<Branch>(model, `${BranchService.endpoint}/Create`);
  }

  /**
   * update branch
   *
   *
   * @param branchId
   */
  update(model: Branch) {
    return this.http.put(model, `${BranchService.endpoint}/Update`);
  }

  /**
   * delete branch
   *
   *
   * @param branchId
   */
  delete(branchId: number) {
    return this.http.delete(`${BranchService.endpoint}/Delete/${branchId}`);
  }

  /**
   * block branch
   * 
   * 
   * @param body 
   */
  blockUnBlockBranch(body: any) {
    return this.http.get(`${BranchService.endpoint}/SetActivate`, body);
  }

  /**
   * search in branchs by name
   *
   *
   * @param name
   */
  searchInBranches(name: string): Observable<any> {
    return this.http.get(`${BranchService.endpoint}/GetByName/${name}`);
  }

  /**
   * list all branchs
   *
   *
   */
  GetBranchesBy(resturantIds: string, geoFenceIds: string) {
    return this.http.get<Branch[]>(
      `${BranchService.endpoint}/GetBranchesByresturantIdsAndgeoFenceIds?resturantIds=${resturantIds}&geoFenceIds=${geoFenceIds}`
    );
  }
}
