import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodesComponent } from './country-codes.component';

describe('CountryCodesComponent', () => {
  let component: CountryCodesComponent;
  let fixture: ComponentFixture<CountryCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
