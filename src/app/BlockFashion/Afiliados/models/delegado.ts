import { Nucleo } from './nucleo';
import { Afiliado } from './afiliado';
export class Delegado {
  id: number;
  nucleo: Nucleo;
  afiliado: Afiliado;
  fecha: Date;
  tipo: String;
}
