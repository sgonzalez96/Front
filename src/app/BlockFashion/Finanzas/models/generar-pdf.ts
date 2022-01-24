export interface IGeneratePDF {
    fechaEmit: Date,
    recCot: number,
    monto: Array<IMontos>,
    descripcion: string,
    cantidad: number,
    medPago: string,
    operacion: string,
    fechDep: Date,
    observaciones: string,
    nucleo: string 
    numNucleo: number
    total: number
    
}

export interface IMontos {
    concepto: string,
    importe: number,  
}
export interface INucleos {
    description: string,
    number: number,  
}