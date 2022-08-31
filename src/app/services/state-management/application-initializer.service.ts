import { SignalRNotificationService } from '@dms/app/services/state-management/signal-rnotification.service';
import { LanguageService } from '@dms/services/translator/language.service';
import { FacadeService } from '@dms/services/facade.service';
import { Inject, Injectable } from '@angular/core';
import { environment } from '@dms/environments/environment';
import { AuthenticatedService } from '@dms/services/state-management/authenticated.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthConstants } from '@dms/app/constants/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { Admin } from '@dms/app/models/settings/profile/Admin';
import { EnvironmentType } from '@dms/app/core/settings';
import { LazyMapsAPILoaderConfigLiteral, LAZY_MAPS_API_CONFIG } from '@agm/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInitializerService {
  constructor(
    private authenticatedService: AuthenticatedService,
    private facadeService: FacadeService,
    private readonly translate: TranslateService,
    private readonly permissionsService: NgxPermissionsService,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private notificationService: SignalRNotificationService,
    @Inject(LAZY_MAPS_API_CONFIG) private mapsConfig: LazyMapsAPILoaderConfigLiteral
  ) {
  }

  public async start(): Promise<any> {
    this.SetSettings();
    this.notificationService.initialize();
    this.languageService.language.subscribe(lng => {
      this.translateService.setDefaultLang(lng);
    });
    const isTokenValid = await this.validateToken();
    if (isTokenValid) {
      this.authenticatedService.changeStatus(true);
    }
    await this.setupAfterAuthenticationActions();
    const initialLoader = document.querySelector('.initial-loader');
    if (initialLoader) {
      initialLoader.remove();
    }
  }

  private async setupAfterAuthenticationActions() {
    this.authenticatedService.currentStatus.subscribe(async isLoggedIn => {
      this.loadUserPermissions();
      if (isLoggedIn) {
        const adminData = await this.facadeService.adminService.GetCurrentAdmin().toPromise();
        await this.setDefaultUserLanguage(adminData);
      }
    });
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage &&
        event.key === AuthConstants.TokenKey &&
        event.oldValue !== event.newValue) {
        window.location.reload();
      }
    });
  }

  private loadUserPermissions() {
    if (localStorage.getItem(AuthConstants.TokenKey) !== null) {
      const token = JSON.parse(localStorage.getItem(AuthConstants.TokenKey));
      const jwt: { permission: string[] } = jwt_decode(token.accessToken);
      this.preparePermissions(jwt.permission);
    }
  }

  private preparePermissions(permissions: string[]) {
    const preparedPermissions: string[] = [];

    // user role
    const role: string = this.facadeService.accountService.user.roleNames[0];
    preparedPermissions.push(role);

    permissions.forEach((permission: string) => {
      const value: string = permission.substring(permission.lastIndexOf('.') + 1);
      preparedPermissions.push(value);
    });

    this.permissionsService.loadPermissions(preparedPermissions);
  }

  private async validateToken(): Promise<boolean> {
    // this can be changed to a differnet way like call validate endpoint
    let data: Admin;
    try {
      data = localStorage.getItem('dms.token') && await this.facadeService.adminService.GetCurrentAdmin().toPromise();
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // logout
        // this.facadeService.accountService.logout();
      }
    }
    return !!data;
  }
  private async setDefaultUserLanguage(data: Admin) {

    const code = this.languageCode(data.dashBoardLanguage);
    this.languageService.changeLanguage(code);
    this.languageService.setDirection(code);
    this.languageService.lngIntoLocalStorage(code);
  }

  private languageCode(language: string): string {
    return language && language === 'Arabic' ? 'ar' : 'en';
  }

  private SetSettings() {
    const baseElement = document.querySelector('base') || {};
    const baseHref = this.getUrlFromAttribute(baseElement, 'href');
    const apiUrl = this.getUrlFromAttribute(baseElement, 'data-apiUrl') || baseHref;
    const mapsKey = this.getDataFromAttribute(baseElement, 'data-mapsKey');
    if (mapsKey) {
      environment.mapSettings.apiKey = mapsKey;
      this.mapsConfig.apiKey = mapsKey;
    }
    if (environment.settings.environmentType !== EnvironmentType.Development && apiUrl) {
      environment.settings.backendUrl = apiUrl;
    }
  }

  private getDataFromAttribute(element: HTMLBaseElement | object, attribute: string) {
    return (element['attributes'][attribute].value || '').trim();
  }

  private getUrlFromAttribute(element: HTMLBaseElement | object, attribute: string) {
    return this.getDataFromAttribute(element, attribute).replace(/\/+$/, '');
  }
}

