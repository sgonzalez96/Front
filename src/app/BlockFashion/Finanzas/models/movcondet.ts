import { Nucleo } from '../../Afiliados/models/nucleo';
import { Afiliado } from '../../Afiliados/models/afiliado';
export class MovContDet{
    id: number;
    fecharecibo: Date;
    nucleo: Nucleo;
    afiliado: Afiliado;
    mespago: string; //AAAAMM
    importe: number;
    cantidad: number;

}