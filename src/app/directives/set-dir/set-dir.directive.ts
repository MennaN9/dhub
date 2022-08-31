import { Directive, ElementRef } from '@angular/core';
import { LanguageService } from '@dms/app/services/translator/language.service';

@Directive({
  selector: '[setDir]'
})
export class SetDirDirective {
  /**
   * 
   * @param el 
   * @param languageService 
   * @param locale 
   */
  constructor(private element: ElementRef,
    private languageService: LanguageService,
  ) {
    this.onChangeLanguage();
  }

  onChangeLanguage() {
    this.languageService.language.subscribe(lng => {
      switch (lng) {
        case 'ar':
          this.element.nativeElement.style.direction = 'rtl';
          this.element.nativeElement.style.textAlign = 'right';
          break;

        default:
          this.element.nativeElement.style.direction = 'ltr';
          this.element.nativeElement.style.textAlign = 'left';
          break;
      }
    });
  }
}
