import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value) {
      return moment(value).format('MM/DD/YYYY hh:mm A');
    }
    return null;
  }

}
