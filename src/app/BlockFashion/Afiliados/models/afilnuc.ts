import { Afiliado } from './afiliado';
import { Nucleo } from './nucleo';

export class AfilNucleo {
    id: number;
    afiliado: Afiliado;
    nucleo: Nucleo;
    cotizante: boolean;
    del1: boolean;
    del2: boolean;
    lab: boolean;
}
