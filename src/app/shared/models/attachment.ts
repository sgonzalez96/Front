
import { DTOUser } from './../../opus/opus-users/models/DTOUser';

export class Attachment {
    head: AttachmentHead = new AttachmentHead;
    file?: File;
}



export class AttachmentHead {
    id: number = 0;
    entidad!: string;
    clave!: string;
    fecha: Date = new Date(Date.now());
    usuario!: DTOUser;
    descripcion!: string;
    ubicacion: string="";
    type!: string;
}




