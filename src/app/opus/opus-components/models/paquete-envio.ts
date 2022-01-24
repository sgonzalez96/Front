import { CdsStorage } from "./cds-storage";
import { Operatorcds } from "../../opus-users/models/operatorcds";
import { PaqueteEnvioItem } from "./paquete-envio-item";

export class PaqueteEnvio {
    id!: number;
    date!: Date;
    storage!: CdsStorage;
    creator!: Operatorcds;
    items!: PaqueteEnvioItem[];
}