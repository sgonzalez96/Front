import { TipoAct } from './tipoact';
import { Usuario } from '../../Admin/models/usuario';
import { Ciudad } from '../../Admin/models/ciudad';

export class Evento {
    id: number;
    nombre: string;
    fecha: Date;
    hora: string;
    ciudad: Ciudad;
    lugar: string;
    link: string;
    tipoact: TipoAct;
    usuario: Usuario;
    status: string;
    desde: Date;
    hasta: Date;
    inscripcion: boolean;
    usalista: boolean;
    asistencia: boolean;
    evaluacion: boolean;
    notas: string;
    urlevaluacion: string;
}
