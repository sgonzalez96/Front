import { CitaEvento } from "./eventos";

//el cabezal 
export interface IAdjuntos {
    id?: number;
    name: string;
    size: number;
    fecha: Date;
    type: string;
}

export class DTOAdjunto {
    idCita?: number;
    head: IAdjuntos[] = [];
    adjuntos: any[]=[];
    evento: CitaEvento;
}


export interface DTODescAdjunto {
    id?: number;
    name: string;
    size: number;
    fecha: Date;
    fkcita:number;
    fkadjunto:number;
    type: string;
}

export interface DTODownloadAdjunto {
    id: number,
    file: BinaryType[],
    fkcita: number,
}