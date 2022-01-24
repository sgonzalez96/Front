import { SesionEnvioPaquete } from './sesion-envio-paquete';

export class SesionEnvioItem {
  senvItemId!: number;
  erpItem!: string;
  prodId!: string;
  prodDsc!: string;
  prodUnit!: string;
  prodBars!: string[];
  savingQuantity!: number;
  savingStatus!: string;
  savedQuantity!: number;
  packages!: SesionEnvioPaquete[];
  expandido!: boolean;
}
