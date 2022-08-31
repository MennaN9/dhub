import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FacadeService } from '@dms/services/facade.service';
import { Routes } from '../constants/routes';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly facadeService: FacadeService) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.facadeService.accountService.isLoggedIn) {
      return true;
    }

    this.router.navigate([Routes.Login]);
    return false;
  }
}
