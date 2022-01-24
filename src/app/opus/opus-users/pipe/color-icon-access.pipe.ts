import { Pipe, PipeTransform } from '@angular/core';
import { Dtoitem } from '../models/DtoItem';

@Pipe({
  name: 'colorIconAccess'
})
export class ColorIconAccessPipe implements PipeTransform {

  transform(value: Dtoitem, args: string): Boolean {
    let checkAll : Boolean = false;
    let checkNone : Boolean = false;
    let checkmedium : Boolean = false;

    // run all object property
    if (value.accede &&
      value.borrado && 
      value.edicion && 
      value.emision && 
      value.funcion1 && 
      value.visualizacion && 
      value.creacion) {
      checkAll = true;
    }else{
      checkmedium = true;
    }



    switch (args) {
      case 'success':
        return checkAll;
      case 'warning':
        return checkmedium;
      default:
        return false;
    }
    
    
    
  }

}
