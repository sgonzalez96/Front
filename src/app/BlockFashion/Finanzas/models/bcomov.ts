import { MovCont } from './movcont';
import { Via } from '../../Admin/models/via';
export class BcoMov {
  id: number;
  fecha: Date;

  descripcion: string;
  documento: string;
  deposito: string;
  asunto: string;

  debito: number;
  credito: number;

  banco: string;
  estado: string; // Vacio = Pendiente, C=Conciliado, X=Eliminado

  movcont: MovCont;
  via: Via;

}
