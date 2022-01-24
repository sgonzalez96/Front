import { Moneda } from '../../Admin/models/moneda';
import { Via } from '../../Admin/models/via';
import { MovContDet } from './movcondet';
export class MovCont {
    id: number;
    fecha: Date;
    tipo: string;
    signo: number;
    mon: Moneda;
    importe: number;
    referencia: string;
    descripcion: string;
    viapago: Via;
    recibo: number;
    notas: string;

    detalle?: MovContDet[];

}