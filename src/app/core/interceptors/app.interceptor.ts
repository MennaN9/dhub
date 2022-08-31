import { TranslateService } from '@ngx-translate/core';
/**
 * App interceptor
 *
 * Used to append Token to header or enable / diable spinner
 *
 *  @author Mustafa Omran <promustafaomran@hotmail.com>
 *
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenResponse } from '@dms/app/models/account/accountResult';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { AccountService } from '@dms/services/auth/account.service';
import { SnackBar } from '@dms/utilities/snakbar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LanguageService } from '@dms/app/services/translator/language.service';

@Injectable()

export class AppInterceptor implements HttpInterceptor {

  constructor(
    private readonly router: Router,
    private accountService: AccountService,
    private snackBar: SnackBar,
    private languageService: LanguageService,
    private loaderService: NgxUiLoaderService,
    private translateService: TranslateService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loaderService.start();

    // if (localStorage.getItem('dms.token') !== null) {
    const token = (JSON.parse(localStorage.getItem('dms.token')) as TokenResponse);
    const currentLanguage = this.languageService.currentLanguage;

    let newHeader = request.headers;
    if (token) {
      newHeader = newHeader.set('Authorization', `Bearer ${token.accessToken}`);
    }

    if (currentLanguage) {
      newHeader = newHeader.set('Accept-Language', currentLanguage);
    }

    request = request.clone(
      {
        headers: newHeader,
      });
    // }

    return next.handle(request).pipe(tap(() => {
      // setTimeout(() => {
      //     this.loaderService.stop();
      // }, 2500);
    },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {

          setTimeout(() => {
            this.loaderService.stop();
          }, 1000);

          // display server errors
          if (err.status == 400) {

            if (typeof err['error'] == 'string') {
              this.snackBar.openSnackBar({ message: `${err['error']}`, action: 'Okay', duration: 3000 });
            }
            else if (typeof err['error']['error'] == 'string') {
              this.snackBar.openSnackBar({ message: `${err['error']['error']}`, action: 'Okay', duration: 3000 });
            }
            else {
              const errorsObject = err['error']['errors'];

              for (let key in errorsObject) {
                if (errorsObject.hasOwnProperty(key)) {

                  errorsObject[key].forEach(error => {
                    this.snackBar.openSnackBar({ message: `${error}`, action: 'Okay', duration: 3000 });
                  });
                }
              }
            }
          }
          if (err.status === 0) {
            this.snackBar.openSnackBar(
              {
                message: this.translateService.instant(
                  'Network connection error occurred or server maybe down, check your connection and try to refresh page.'),
                action: this.translateService.instant('Okay'),
                duration: 10000
              });
            return true;
          }
          if (err.status !== 401) {
            return;
          }

          if (err.status == 401) {
            this.accountService.logout();
            this.router.navigate([Routes.Login]);
          }
        } else {
          setTimeout(() => {
            this.loaderService.stop();
          }, 2500);
          this.snackBar.openSnackBar({ message: 'Server Error !', action: 'Okay', duration: 3000 });
        }
      }));

  }

}
