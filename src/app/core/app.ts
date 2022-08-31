import { environment } from '../../environments/environment';

/**
 * App singleton design pattern of the required settings
 *
 *
 */
export class App {

    /**
     * Building backend Full Base URL
     */
    static get backEndUrl(): string {
        return environment.settings.backendUrl;
    }

    /**
     * Building backend Full Base URL for Driver Images
     */
    static get driverImagesUrl(): string {
        return `${environment.settings.backendUrl}/DriverImages/`;
    }

    /**
  * Building backend Full Base URL for Driver Images
  *
  */
    static get taskImagesUrl(): string {
        return `${environment.settings.backendUrl}/TasksImages/`;
    }
}
