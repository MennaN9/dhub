import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface State {
  name: string;
}

@Component({
  selector: 'app-exercise-your-rights',
  templateUrl: './exercise-your-rights.component.html',
  styleUrls: ['./exercise-your-rights.component.scss']
})
export class ExerciseYourRightsComponent implements OnInit {

  trackingPanelCtrl = new FormControl();
  dashboardLangCtrl = new FormControl();

  filteredStates: Observable<State[]>;

  states: State[] = [
    {
      name: 'Arkansas',
    },
    {
      name: 'California',
    },
    {
      name: 'Florida',
    },
    {
      name: 'Texas',
    }
  ];

  constructor() {
    this.filteredStates = this.trackingPanelCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );

    this.filteredStates = this.dashboardLangCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.states.slice())
      );
  }

  ngOnInit() {

  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
