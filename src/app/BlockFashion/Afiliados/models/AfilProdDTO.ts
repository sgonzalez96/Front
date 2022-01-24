export class AfilProdDTO {
    cedula : string;
    nombres : string;
    apellidos : string;
    enable : boolean;
    producto : string;
    fechaAsig : Date;
    caracteristicas : string;
    nucleoId? : string;
    nucleoNombre? : string;
}

export class Order{
    producto: string ;
    fechaAsig : string ;
    caracteristicas: string ;
}