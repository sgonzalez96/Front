import { Ciudad } from "../../Admin/models/ciudad";

export interface IReportAfilProd {
     nombresAfil: string,
     apellidos: string,
	 cedula: string,
	 producto: string,
	 caracteristicas: string,
	 fechaAsig: string,
	 ciudad: Ciudad,
}