export class SeparationOrderItem {
  itemId!: number;
	pickedQuantity!: number;
	pickingOrder!: number;
	orignalQuantity!: number;
	lastPickDate!: Date;
	locationId!: string;
	operator!: string;
	loadType!: string;
	point!: string;
	productCode!: string;
  productDsc!: string;
}
