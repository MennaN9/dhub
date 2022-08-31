import { Settings, EnvironmentType } from '@dms/app/core/settings';
import { MapSettings } from '@dms/app/core/map-settings';

/**
 * Base URL settings (development)
 *
 *
 */
const settings: Settings = {
  backendUrl:'http://3.10.142.186/DHub',//'https://dhub.pro',
  // backendUrl: 'http://3.10.142.186/DHub',
  environmentType: EnvironmentType.Production
};

const mapSettings: MapSettings = {
  apiKey: 'AIzaSyCby4SQY3N1ruaURgAFkJ7RscwmNla_kUs',
  libraries: ['places', 'geometry'],
};

export const environment = {
  production: false,
  settings: settings,
  mapSettings: mapSettings
};
