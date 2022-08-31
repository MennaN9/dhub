import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { FacadeService } from "../../facade.service";

@Injectable({
    providedIn: 'root',
})

/**
 * Resolver to Fetch User Data
 * 
 * 
 */
export class profileResolver implements Resolve<any>{
    constructor(private facadeService: FacadeService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.facadeService.adminService.GetCurrentAdmin();
    }
}