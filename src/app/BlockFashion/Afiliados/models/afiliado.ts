import { Ciudad } from '../../Admin/models/ciudad';
import { Localidad } from '../../Admin/models/localidad';
import { Cargo } from '../../Admin/models/cargo';
import { Nucleo } from './nucleo';
import { AfiliadosService } from '../serv/afiliados.service';
import { AfilNucleo } from './afilnuc';
export class Afiliado {

    cedula: string;

    // --- datos filiatorios
    nombres: string;
    apellidos: string;
    email: string;
    direccion: string;
    ciudad: Ciudad;
    loc: Localidad;
    telefonos: string;
    celular: string;
    sexo: string;
    fecnac: Date;
    composicion: string;

    // --- datos laborales
    cargo: Cargo;
    anioinginst: number;
    anioingsec: number;
    publico: boolean;

    // --- datos SINTEP
    ficha: string;
    fichapapel: boolean;
    fichaimg: any[];
    enable: boolean;
    status: string;    // Status de la ficha, Iniciada, Aprobada, Terminada
    tipo: string;      // Afiliado, Fundador, Otro
    notas: string;
    feculting: Date;
    fecsoling: Date;
    feculbaja: Date;
    fecultpago: String; //AAAAMM para afiliados individuales nucleo = 1

    txtciudad: string;
    txtlocalidad: string;
    txtcargo: string;
    txtdepto: string;

    elnucleo: number;


    constructor() {
        //la ficha podria autonumerarse con dto del vtoc
        this.enable = false;
        this.status = 'I';
        this.tipo = 'A';
    }
}
