export interface IMail {
    destino: string,
    asunto: string,
    texto: string,
    cc?: string
}