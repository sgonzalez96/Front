import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumber'
})
export class NumberPipe implements PipeTransform {

    transform(value: number, args: boolean): string {
        if (args) {
            return new Intl.NumberFormat("de-DE", {minimumIntegerDigits: 1,minimumFractionDigits: 2,maximumFractionDigits:2} ).format(value);
        } else  {
            return new Intl.NumberFormat("de-DE", {minimumIntegerDigits: 1,minimumFractionDigits: 0,maximumFractionDigits:0} ).format(value);
        }
      

    }

}
