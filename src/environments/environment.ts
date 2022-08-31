import { MapSettings } from "@dms/app/core/map-settings";
import { Settings, EnvironmentType } from "@dms/app/core/settings";

/**
 * Base URL settings (development)
 *
 *
 */
const settings: Settings = {
  backendUrl: 'http://37.34.189.202:8030/dms/development', //'http://3.10.142.186/DHub',
  // backendUrl: 'http://localhost:5000',
  environmentType: EnvironmentType.Development
};

const mapSettings: MapSettings = {
  apiKey: 'AIzaSyCby4SQY3N1ruaURgAFkJ7RscwmNla_kUs',
  libraries: ['places', 'geometry']
};

export const environment = {
  production: false,
  settings: settings,
  mapSettings: mapSettings
};
