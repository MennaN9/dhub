import { MapSettings } from "@dms/app/core/map-settings";
import { Settings, EnvironmentType } from "@dms/app/core/settings";

/**
 * Base URL settings (development)
 *
 *
 */
const settings: Settings = {
  backendUrl: 'https://localhost:44337/api/',
  environmentType: EnvironmentType.Staging
};

const mapSettings: MapSettings = {
  apiKey: 'AIzaSyCby4SQY3N1ruaURgAFkJ7RscwmNla_kUs',
  libraries: ['places', 'geometry']
};

export const environment = {
  production: false,
  staging: true,
  settings: settings,
  mapSettings: mapSettings
};
