import { Component, OnInit, Output, EventEmitter, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Place } from '@dms/app/models/general/place';
import { FacadeService } from '@dms/app/services/facade.service';
import { LanguageService } from '@dms/app/services/translator/language.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-place',
  templateUrl: './search-place.component.html',
  styleUrls: ['./search-place.component.scss']
})
export class SearchPlaceComponent implements OnInit, OnChanges, OnDestroy {

  lng: string = 'en';
  places: Place[] = [];
  subscriptions = new Subscription();
  isRequired: boolean = true;

  searchControl: FormControl;
  debounce: number = 400;

  @Output() onPlace: EventEmitter<Place> = new EventEmitter<Place>();
  @Input() previousAddress: string = '';

  /**
   * 
   * @param facadeService 
   * @param languageService 
   */
  constructor(private facadeService: FacadeService, private languageService: LanguageService) {
    if (this.isRequired) {
      this.searchControl = new FormControl('', [Validators.required]);
    } else {
      this.searchControl = new FormControl('');
    }
  }

  ngOnInit() {
    this.languageService.language.subscribe(lng => {
      this.lng = lng;
    });

    this.searchControl.valueChanges.pipe(debounceTime(this.debounce), distinctUntilChanged()).subscribe((query: string) => {
      if (query.length > 0) {
        this.subscriptions.add(this.facadeService.mapsService.searchQuery(query, this.lng).subscribe((places: []) => {
          this.places = places;
        }));
      } else {
        this.places = [];
      }
    });
  }

  setPlace(place: Place): void {
    this.onPlace.emit(place);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.previousAddress && changes.previousAddress.currentValue.length > 0) {
      this.searchControl.setValue(changes.previousAddress.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
