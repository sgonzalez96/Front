import { MovCont } from './movcont';
import { Afiliado } from '../../Afiliados/models/afiliado';
import { Nucleo } from '../../Afiliados/models/nucleo';
import { Via } from '../../Admin/models/via';
export class BcoPago {
  id: number;
  fecha: Date;
  descripcion: string;
  referencia: string;
  importe: number;

  banco: string;
  estado: string; // Vacio = Pendiente, C=Conciliado, X=Eliminado
  notas: string;

  movcont: MovCont;
  nucleo: Nucleo;
  afiliado: Afiliado;
  via: Via;
}
