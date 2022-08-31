import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorI18n {

    /**
     * 
     * @param translate 
     */
    constructor(private readonly translate: TranslateService) { }

    /**
     * config paginator
     * 
     * 
     */
    getPaginatorIntl(): MatPaginatorIntl {
        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = this.translate.instant('Items per page');
        paginatorIntl.nextPageLabel = this.translate.instant('Next page');
        paginatorIntl.previousPageLabel = this.translate.instant('Previous page');
        paginatorIntl.firstPageLabel = this.translate.instant('First page');
        paginatorIntl.lastPageLabel = this.translate.instant('Last page');
        paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

        return paginatorIntl;
    }

    /**
     * 
     * @param page 
     * @param pageSize 
     * @param length 
     */
    private getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0 || pageSize === 0) {
            return this.translate.instant('Range page 1', { length });
        }

        length = Math.max(length, 0);
        const startIndex = page * pageSize;

        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return this.translate.instant('Range page 2', { startIndex: startIndex + 1, endIndex, length });
    }
}