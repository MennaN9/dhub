import { SnackBar } from './../../utilities/snakbar';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {
  constructor(
    @Inject(Injector) private readonly injector: Injector,
    private snackBar: SnackBar,
    private translateService: TranslateService
  ) {
    super();
  }

  handleError(error: any): void {
    // get error in case it was caught in promise
    const actualError = error.rejection || error;
    if (this.handleChunkLoadError(actualError)) {
      return;
    }
  }

  private handleChunkLoadError(error: any): boolean {
    if (error && error.name === 'ChunkLoadError') {
      this.snackBar.openSnackBar({
        message: this.translateService.instant(`Network error, unable to load module, try to refresh page.`),
        action: this.translateService.instant('Okay'),
        duration: 5000
      });
      return true;
    }
    return false;
  }
}
