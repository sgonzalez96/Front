import { Operatorcds } from '../../opus-users/models/operatorcds';
export class SesionEnvioHead {
  id!: number;
	description!: string;
	creationDate!: Date;
	user!: Operatorcds;
	status!: string;
	savingStatus!: string;
	targetStorageId!: string;
	targetStorageDsc!: string;
	ctaDsc!: string;
	address!: string;
	location!: string;
	agenciaId!: string;
	agenciaDsc!: string;
	cntPaquetes!: number;
	finishDate!: Date;
	ticket!: string;
}
