import { Clients } from './clients';
import { Operatorcds } from '../../opus-users/models/operatorcds';
import { CdsStorage } from './cds-storage';
import { Lanes } from './lanes';
import { SeparationItem } from './separation-item';
export class Separation {
  separationId!: number;
  startDate!: Date;
  endDate!: Date;
  state!: string;
  clientId!: Clients;
  creator!: Operatorcds;
  targetStorageId!: string;
  targetStorageDsc!: string;
  laneId!: Lanes;
  owner!: Operatorcds;
  separationItemsList!: SeparationItem[];
}
