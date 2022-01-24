import { Pipe, PipeTransform } from '@angular/core';
import { Deptos } from '../models/depto';

@Pipe({
  name: 'departamento'
})
export class DepartamentoPipe implements PipeTransform {

  transform(value: Deptos, arg: string): boolean {
    if (value != null) {
      let hidden: boolean = true;
    console.log(arg,value);
    if (arg == "M" && value.id == 10) {
      hidden= false;
    }else if(arg != "M" && value.id != 10){
      hidden = false;
    }
    console.log(hidden);
    return hidden;
    }else{
      return true;
    }
  }

}
