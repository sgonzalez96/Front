import { OrderHeader } from './order-header';
import { SeparationOrderItem } from './separation-order-item';
export class SeparationOrder {
  separationId!: number;
  separationStartDate!: Date;
  separationState!: string;
  separationEndDate!: Date;
  clientId!: string;
  clientDsc!: string;
  separationCreator!: string;
  separationTargetStorageDsc!: string;
  separationLaneDsc!: string;
  separationOwner!: string;
  separationItems!: SeparationOrderItem[];
  orders!: OrderHeader[];
}
