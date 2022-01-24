import { CitaEvento } from './eventos';
import { IAdjuntos } from './adjuntos';
import { Cita } from './citalegal';

export class citaDTO {
    cita: Cita = new Cita;
    textolog: string;
    usuId: number;
    adjuntos: Array<any> = [];  // el array de bytes 
    descAdjuntos: IAdjuntos[]=[]; // para grabar una tabla con la descripcion 
    vamail : boolean= true; // controla si envia mail o no , por defecto true
    
}