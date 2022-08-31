import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToTimezone'
})
export class DateToTimezonePipe implements PipeTransform {

  transform(date: any, ...args: any[]): any {
    let currentDate = new Date(date);
    let dateByTimezone = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000);

    const offset = currentDate.getTimezoneOffset() / 60;
    const hours = currentDate.getHours();

    dateByTimezone.setHours(hours - offset);
    return `${dateByTimezone.toLocaleDateString() + ' ' + dateByTimezone.toLocaleTimeString()}`;
  }

}
