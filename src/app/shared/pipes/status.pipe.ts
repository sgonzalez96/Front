import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let devol = 'S/D';
    switch (value) {
      case 'S':
        devol = 'En separación';
        break;

      case 'T':
        devol = 'Terminada';
        break;

      case 'L':
        devol = 'Sin usuario';
        break;
      case 'P':
        devol = 'Pendiente';
        break;
    }

    return devol;
  }

}
