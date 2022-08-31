import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly DEFAULT_LANGUAGE = 'en';
  private LANGUAGE: string;
  private currentLng: BehaviorSubject<string> = new BehaviorSubject('en');

  constructor(private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document) {

    if (localStorage.getItem('LANGUAGE')) {
      this.LANGUAGE = localStorage.getItem('LANGUAGE');
      this.currentLng.next(this.LANGUAGE)
    }
  }

  /**
   * change language
   *
   */
  changeLanguage(lng: string): void {
    const code = lng.replace(/"/g, "");
    this.LANGUAGE = code;

    this.setDirection(this.LANGUAGE);
    this.lngIntoLocalStorage(this.LANGUAGE);

    this.translate.use(this.LANGUAGE);
    this.currentLng.next(this.LANGUAGE);
    this.translate.setDefaultLang(this.LANGUAGE);
  }

  /**
   * current language
   * 
   * 
   */
  get currentLanguage(): string {
    const languageCode: string = localStorage.getItem('LANGUAGE') || this.DEFAULT_LANGUAGE;
    return languageCode.replace(/"/g, "");
  }

  /**
   * selected language
   *
   */
  get language(): Observable<string> {
    return this.currentLng.asObservable()
  }

  /**
   * store language code into LS
   * 
   * 
   * @param lng 
   */
  lngIntoLocalStorage(lng: string) {
    return localStorage.setItem('LANGUAGE', lng);
  }

  /**
   * 
   * @param languageCode 
   */
  setDirection(languageCode: string) {
    if (languageCode == 'ar') {
      this.document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      this.document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl');
      this.document.getElementsByTagName('body')[0].setAttribute('class', 'rtl');
    }

    if (languageCode == 'en') {
      this.document.getElementsByTagName('html')[0].removeAttribute('dir');
      this.document.getElementsByTagName('body')[0].removeAttribute('dir');
      this.document.getElementsByTagName('body')[0].removeAttribute('class');
    }
  }

}
