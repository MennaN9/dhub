import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAccountsSettingsComponent } from './business-accounts-settings.component';

describe('BusinessAccountsSettingsComponent', () => {
  let component: BusinessAccountsSettingsComponent;
  let fixture: ComponentFixture<BusinessAccountsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAccountsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAccountsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
