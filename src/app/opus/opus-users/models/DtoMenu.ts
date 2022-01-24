import { Dtoitem } from './DtoItem';
export class Dtomenu {
  id: number|undefined;
  descripcion: string|undefined;
  icono: string|undefined;
  items: Dtoitem[]|undefined;
}
