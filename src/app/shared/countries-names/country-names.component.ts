/**
 * Country Codes Component
 * 
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CountryService } from '@dms/services/settings/country.service';
import { Country } from '@dms/app/models/settings/Country';
import { LocalStorageKeys } from '@dms/constants/localstorage-keys';
import { IpInfoService } from '@dms/services/info/ip-info.service';

@Component({
  selector: 'app-countries',
  templateUrl: './country-names.component.html',
  styleUrls: ['./country-names.component.scss']
})
export class CountryNamesComponent implements OnInit, OnChanges {
  public readonly imageUrl = 'assets/images/flags/';

  @Output() country: EventEmitter<Country> = new EventEmitter<Country>();
  @Input() previousCountryId: number;
  @Input() disabled: boolean = false;

  states: Country[] = [];
  selectedState: Country;
  msgError: string = '';

  /**
   *
   * @param countryService
   */
  constructor(private countryService: CountryService, private infoService: IpInfoService) {
  }

  ngOnInit() {
    if (localStorage.getItem(LocalStorageKeys.countries) != null) {
      this.states = JSON.parse(localStorage.getItem(LocalStorageKeys.countries));
    } else {
      this.countriesCodes();
    }

    // push old value
    if (this.previousCountryId) {
      this.setSelectedPrevious(this.states, this.previousCountryId);
      this.setValue();
    } else {
      const selectedCountry = this.states.filter(state => {
        return state.code == String(965);
      })[0];

      // set kuwait default country
      if (selectedCountry && selectedCountry.id) {
        this.setSelectedPrevious(this.states, selectedCountry.id);
        this.setValue();
      }
    }
  }

  /**
   * 
   * @param simpleChanges 
   */
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.previousCountryId) {
      // push old value
      if (simpleChanges.previousCountryId.currentValue) {
        this.setSelectedPrevious(this.states, simpleChanges.previousCountryId.currentValue);
      }
    }
  }

  /**
   * list countries codes
   *
   *
   */
  countriesCodes() {
    this.countryService.list().subscribe((countries: Country[]) => {
      this.states = countries;
      localStorage.setItem(LocalStorageKeys.countries, JSON.stringify(countries));
    });
  }

  /**
   * emit country value
   *
   *
   * @param event
   */
  setValue() {
    this.country.emit(this.selectedState);
  }

  /**
   * set selected previous country
   *
   *
   * @param countries
   * @param id
   */
  setSelectedPrevious(countries: Country[], id: number) {
    countries.forEach(country => {
      if (country.id == id) {
        this.selectedState = country;
      }
    })
  }

  /**
   * set selected previous country
   * 
   * 
   * @param countries 
   * @param code 
   */
  setSelectedPreviousAccordingToCode(countries: Country[], code: string) {
    countries.forEach(country => {
      if (country.topLevel == code.toLocaleLowerCase()) {
        this.selectedState = country;
        this.country.emit(this.selectedState);
      }
    })
  }

}
