import { Afiliado } from '../../Afiliados/models/afiliado';
import { Nucleo } from '../../Afiliados/models/nucleo';
import { Abogado } from './abogado';
import { IAdjuntos } from './adjuntos';

export class Cita {
    id: number;
    afiliado: Afiliado;
    nucleo: Nucleo;
    fecsol: Date;
    motivo: string;
    prefiere: string;
    abogPrefiere: string;
    status: string; // Solicitada, Agendada, Cancelada, Cumplida
    fecagenda: Date;
    horagenda: string;
    abogado: Abogado;
    asistio: boolean;
    resultado: string;
    notas: string;
}
