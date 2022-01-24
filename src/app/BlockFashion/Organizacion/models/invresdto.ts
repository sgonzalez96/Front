import { Evento } from './evento';
import { Afiliado } from '../../Afiliados/models/afiliado';
export class InvResDTO {
    evento: Evento;
    afiliado: Afiliado;
    cedula: string;
    accion: string;
    resultado: string;
}