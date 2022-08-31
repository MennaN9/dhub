import { TestBed } from '@angular/core/testing';

import { NotificationsSettingsService } from './notifications-settings.service';

describe('NotificationsSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationsSettingsService = TestBed.get(NotificationsSettingsService);
    expect(service).toBeTruthy();
  });
});
