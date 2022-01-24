import { SesionEnvioItem } from './sesion-envio-item';

export class SesionEnvioSD {
  erpId!: string;
  sesionId!: number;
  record!: string;
  date!: Date;
  accountId!: string;
  accountDsc!: string;
  accountDir!: string;
  accountLoc!: string;
  savingStatus!: string;
  forwarderId!: number;
  enableChangeData!: boolean;
  items!: SesionEnvioItem[];
}
