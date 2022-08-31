/**
 * AutoAllocation class
 *
 *
 * @class AutoAllocation
 */

export class SettingsViewModel {
  constructor(
      public id: number,
      public settingKey: string,
      public value: string,
      public settingDataType: string,
      public groupId: number,
  ){}
}
