import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   * filter array of strings
   * 
   * 
   * @param items 
   * @param searchText 
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    const result = items.filter(item => {
      if (item && item.name) {
        return item.name.toLowerCase().includes(searchText.toLowerCase());
      } else if (item) {
        return item.toLowerCase().includes(searchText.toLowerCase());
      }

      return false;
    });

    return result;
  }
}
