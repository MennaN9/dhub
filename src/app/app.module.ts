// import { GlobalErrorHandlerService } from './services/state-management/global-error-handler.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode, Injectable, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// routing strategy
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

// components
import { AppComponent } from './app.component';
import { FullComponent } from './layouts/full/full.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';

// shared
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientService } from '@dms/app/core/http-client/http-client.service';
import { AppInterceptor } from '@dms/app/core/interceptors/app.interceptor';

// gaurds
import { AuthGuard } from '@dms/app/guards/auth.guard';

// core module
import { CoreModule } from '@dms/app/core/core.module';

// plugins
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  NgxUiLoaderHttpModule,
} from 'ngx-ui-loader';
// import * as Sentry from "@sentry/browser";
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { DateToTimezoneModule } from './pipes/date-to-timezone/date-to-timezone.module';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'
import { environment } from '@dms/environments/environment';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: 'orange',
  bgsColor: 'orange',
  bgsPosition: POSITION.centerCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce,
  fgsType: SPINNER.rectangleBounce,
  pbThickness: 5,
  blur: 10,
  delay: 0,
  hasProgressBar: false,
  overlayColor: 'rgba(255,255,255,0)',
};

// Sentry.init({
//   dsn: "https://417bc393a2d7497ea56059ad672ea512@o376081.ingest.sentry.io/5197919"
// });

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from './services/translator/language.service';
import { MenuListItemComponent } from './layouts/full/menu-list-item/menu-list-item.component';
import { ClickOutsideModule } from './directives/click-outside/click-outside.module';
import { MatPaginatorIntl } from '@angular/material';
import { PaginatorI18n } from './helpers/paginator-intl';
import { TruncateTextModule } from './pipes/truncate-text/truncate-text.module';
import { ApplicationInitializerService } from './services/state-management/application-initializer.service';

// @Injectable()
// export class SentryErrorHandler implements ErrorHandler {
//   constructor() { }
//   handleError(error) {
//     Sentry.captureException(error.originalError || error);
//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    SpinnerComponent,
    AppSidebarComponent,
    MenuListItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    // Endpoint settings
    HttpClientModule,

    // shared
    SharedModule,

    // material
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    CoreModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatExpansionModule,

    RouterModule.forRoot(AppRoutes, { useHash: true }),
    FormsModule,

    DatePickerModule,
    DateRangePickerModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule,
    TruncateTextModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    NgxPermissionsModule.forRoot(),
    DateToTimezoneModule,

    AgmCoreModule.forRoot(environment.mapSettings),
    MatGoogleMapsAutocompleteModule,
    AgmDirectionModule.forRoot(),

    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot(ngxUiLoaderConfig),
    ClickOutsideModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    HttpClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (applicationInitializer: ApplicationInitializerService) => () => applicationInitializer.start(),
      deps: [ApplicationInitializerService],
      multi: true
    },
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandlerService
    // },
    AuthGuard,
    // {
    //   provide: ErrorHandler,
    //   useClass: SentryErrorHandler
    // },
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: (translateService: TranslateService) => new PaginatorI18n(translateService).getPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
