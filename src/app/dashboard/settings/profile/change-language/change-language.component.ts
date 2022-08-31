import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FacadeService } from '@dms/app/services/facade.service';
import { SnackBar } from '@dms/app/utilities';
import { ChangeLanguage } from '@dms/app/models/settings/profile/ChangeLanguage';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent implements OnInit {

  filteredBoardLangs: Observable<Language[]>;
  @Input() myLanguages: ChangeLanguage;

  languages: Language[] = [
    {
      name: 'Arabic',
    },
    {
      name: 'English',
    }
  ];

  form: FormGroup;
  constructor(fb: FormBuilder,
    private snackBar: SnackBar,
    private facadeService: FacadeService,
    private translateService: TranslateService
  ) {

    this.form = fb.group({
      DashBoardLanguage: ['Arabic'],
      // TrackingPanelLanguage: ['English']
    });
  }

  ngOnInit(): void {
    // this.filteredTrackingLangs = this.form.get("TrackingPanelLanguage").valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => this.filterStates(state))
    //   );

    this.filteredBoardLangs = this.form.get("DashBoardLanguage").valueChanges
      .pipe(startWith(''), map(state => this.filterStates(state)));

    this.form.setValue(this.myLanguages);
  }

  /**
   * filter states
   *
   *
   * @param value
   */
  private filterStates(value: string): Language[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter(lang => lang.name.toLowerCase().includes(filterValue));
  }

  /**
   * change lang
   *
   *
   */
  onSubmit() {
    let body = this.form.value;
    this.facadeService.adminService.changeLanguage(body).subscribe(res => {
      if (res.succeeded === true) {
        this.setLanguageCode(body['DashBoardLanguage']);
        this.snackBar.openSnackBar({ message: this.translateService.instant('Successfully changed'), action: this.translateService.instant('okay'), duration: 2500 });
      }
    });
  }

  /**
   * change code
   * 
   * 
   * @param language 
   */
  setLanguageCode(language: string): void {
    if (language === 'Arabic') {
      this.facadeService.languageService.lngIntoLocalStorage('ar');
      this.facadeService.languageService.changeLanguage('ar');
      this.facadeService.languageService.setDirection('ar');
    } else {
      this.facadeService.languageService.lngIntoLocalStorage('en');
      this.facadeService.languageService.changeLanguage('en');
      this.facadeService.languageService.setDirection('en');
    }
  }
}

