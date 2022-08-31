/**
 * Setting interface 
 * 
 * @interface Settings
 */

export interface Settings {
  backendUrl: string;
  environmentType: EnvironmentType;
  requestTimeout?: number;
  cookieHeader?: boolean;
  allowOffline?: boolean;
}

export enum EnvironmentType {
    Production,
    Staging,
    Development
}
