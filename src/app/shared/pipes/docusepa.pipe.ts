import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'docusepa'
})
export class DocusepaPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (value == null || value == undefined || value == '') {
      return '';
    }
    let anotherString = value.replace(/,/g, ' ');
    return anotherString;
  }

}
