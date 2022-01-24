import { Operatorcds } from "../../opus-users/models/operatorcds";

export class Device {
  deviceId!: string;
  deviceDsc!: string;
  store!: string;
  opusUser!: string;
  activeOperator!: Operatorcds;
}
