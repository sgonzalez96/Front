import { Via } from '../../Admin/models/via';
import { Ciudad } from '../../Admin/models/ciudad';
import { Localidad } from '../../Admin/models/localidad';

export class Nucleo {

    id: number;
    enable: boolean;

    nombre: string;
    subgrupo: number;
    institucion: string;
    fantasia: string;
    direccion: string;
    email: string;
    ciudad: Ciudad;
    loc: Localidad;
    telefono: string;
    formacivil: string;
    anio: number;

    via: Via;
    cuenta: string;
    fecingreso: Date;
    fecinipago: Date;
    fecultpago: String;
    delegado1: number;
    fecultd1: Date;
    delegado2: number;
    fecultd2: Date;
    tipo_cot: string = "F";
    categoria: String;
    fecrev?: Date;
    padron?: string;


    constructor() {
        this.nombre = '';
    }
}
