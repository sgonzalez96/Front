import { Operatorcds } from '../../opus-users/models/operatorcds';
import { CdsStorage } from './cds-storage';
import { SesionEnvioSD } from './sesion-envio-sd';
import { PaqueteEnvio } from './paquete-envio';
export class SesionEnvio {
    sesionId!: number;
    description!: string;
    creationDate!: Date;
    operator!: Operatorcds;
    status!: string; // L=Libre, P=Proceso, T=Terminada
    storage!: CdsStorage;
    targetStorageId!: string;
    targetStorageDsc!: string;
    notes!: string;
    finishDate!: Date;
    accountId!: string;
    accountDsc!: string;
    accountDir!: string;
    accountLoc!: string;
    forwarderId!: string;
    forwarderDsc!: string;
    listSD!: SesionEnvioSD[];
    savingStatus!: string;
    packages!: PaqueteEnvio[];
}