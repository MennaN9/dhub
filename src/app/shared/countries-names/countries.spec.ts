import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryNamesComponent } from './country-names.component';

describe('CountryCodesComponent', () => {
  let component: CountryNamesComponent;
  let fixture: ComponentFixture<CountryNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
