import { Byte } from '@angular/compiler/src/util';
import { Rol } from './rol';


export class Usuario {
  idUser: number | undefined;
  userName: string | undefined;
  password: string | undefined;
  enable: boolean | undefined;
  nombreCompleto: string | undefined;
  direccion: string | undefined;
  email: string | undefined;
  contacto: string | undefined;
  telefono: string | undefined;
  foto: any[] | undefined;
  authExpiration: Date | undefined;
  authToken: string | undefined;
  idEmpresa: string | undefined;
  pais: string | undefined;
  dobleAuth: boolean | undefined;
  roles: Rol[] | undefined;
  cal_reg: string | undefined;
  cal_firma: Byte[] =[]; 

}
