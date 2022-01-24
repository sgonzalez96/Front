import { Usuario } from './usuario';
export class Log {
    id: number;
    fecha: Date;
    usuafitipo: string;
    usuafinro: number;
    evento: string;
    descripcion: string;
    autor: Usuario;
    logtipo: string;  //tipo de evento de log
    loskey: string;   //clavepor ejemplo a un evento, o a un pago, etc. 
}