export class  Dtoitem {
  id: number | undefined;
  descripcion: string | undefined;
  url: string | undefined;
  fkgrupo: number | undefined;
  orden: number | undefined;
  prmrol: string | undefined; /* S=Si N=No U=Undefined */
  prmusu: string | undefined; /* S=Si N=No U=Undefined */
  fkrol: number | undefined;
  fkusu: number | undefined;
  accede: boolean | undefined;
  // detalles de permisos
  creacion: boolean = false;
  edicion: boolean = false;
  borrado: boolean = false;
  visualizacion: boolean = false;
  emision: boolean = false;
  funcion1: boolean = false;
}
