import { Evento } from './evento';
import { Afiliado } from '../../Afiliados/models/afiliado';
export class Invitacion {
    id: number;
    evento: Evento;
    afiliado: Afiliado;
    cedula: string;
    status: string;
    fecult: Date;
    costo: number;
    costostat: string;  //Definido, //Pago,  //Confirmado 
    inscripto: boolean;
    asistio: boolean;
    evalnota: string;
    rating: number;
}
