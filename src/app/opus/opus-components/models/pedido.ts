import { Clients } from './clients';
import { Lanes } from './lanes';
import { StorageCds } from './storage-cds';
import { PedidoItem } from './pedido-item';
export class Pedido {
  orderId!: number;
  recordNumber!: string;
  date!: Date;
  ppcc!: string;
  address!: string;
  city!: string;
  state!: string;
  documentNumber!: string;
  erpStage!: string;
  inSeparation!: boolean;
  client!: Clients;
  lane!: Lanes;
  sourceStorage!: StorageCds;
  targetStorageId!: string;
  targetStorageDsc!: string;
  orderItemsList!: PedidoItem[];
  notes!: string;
}
