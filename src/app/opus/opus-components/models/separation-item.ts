import { Operatorcds } from '../../opus-users/models/operatorcds';
import { LoadType } from './load-type';
import { Product } from './product';
import { Location } from './location';
export class SeparationItem {
    id!: number;
    pickedQuantity!: number;
    pickingOrder!: number;
    orignalQuantity!: number;
    lastPickDate!: Date;
    // itemId: Orderitem;
    location!: Location;
    operator!: Operatorcds;
    loadType!: LoadType;
    point!: string;
    productCode!: Product;
}
