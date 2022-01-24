import { IGeneratePDF, IMontos, INucleos } from './../models/generar-pdf';
import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { MovCont } from '../models/movcont';
import { MovContDet } from '../models/movcondet';
import { Nucleo } from '../../Afiliados/models/nucleo';



@Injectable({
  providedIn: 'root'
})
export class GenerarPdfService {

  // create instance


  // data
  private logo = new Image();



  constructor() {
    this.logo.src = '../../../../assets/img/logo/logo_sintep.jpg';
  }
  // IGeneratePDF
  generarPDF(arr: MovCont[]) {

    // format
    let genPdf = new jsPDF("p", "pt", "A4");
    genPdf.setFontSize(10);

    // check all item
    for (let i = 0; i < arr.length; i++) {

      let marginTop = 150;
      let marginleftColumn1 = 100;
      let marginleftColumn2 = 350;
      // get arr detail 
      let detail: Array<any> = this.generateArrDetalle(arr[i].detalle);
      let date: string[] = this.getDate(arr[i].fecha.toString());

      let cantDetail: number = this.getCantDetail(arr[i].detalle);
      let nucleoDetalle = this.getNucleo(arr[i].detalle);

      // logo
      genPdf.addImage(this.logo, 'JPEG', 110, 20, 350, 70);

      // head
      genPdf.text("EDUARDO VÍCTOR HAEDO 2067", marginleftColumn1, marginTop - 30, { align: 'left' });
      genPdf.text("E-mail: secretariado@sintep.org.uy", marginleftColumn1, marginTop - 20, { align: 'left' });
      genPdf.text("TELEFONO: 24008482", marginleftColumn2 + 10, marginTop - 30, { align: 'justify' });
      genPdf.text("Web: sintep.org.uy", marginleftColumn2 + 10, marginTop - 20, { align: 'justify' });


      // table date Emit
      autoTable(genPdf, {
        head: [['DIA', 'MES', 'AÑO']],
        body: [
          [date[0], date[1], date[2]],
        ],
        tableWidth: 110,
        margin: [marginTop, 10, 10, marginleftColumn1],
        styles: { fontSize: 10 }
      });

      genPdf.text("RECIBO DE COTIZACIONES", marginleftColumn2, marginTop + 10, { align: 'justify' });
      genPdf.text(`NUMERO: ${arr[i].recibo}`, marginleftColumn2, marginTop + 25, { align: 'justify' });
      marginTop = marginTop + 60;
      // table Importes
      autoTable(genPdf, {
        head: [['Conceptos', 'Importes']],
        body: detail,
        tableWidth: 180,
        margin: [marginTop, 10, 10, marginleftColumn1],
        styles: { fontSize: 10 }
      });

      genPdf.text(`Cantidad de cotizantes: ${cantDetail}`, marginleftColumn2, marginTop, { align: 'justify' });
      genPdf.text(`Medio de pago: ${arr[i].viapago.nombre}`, marginleftColumn2, marginTop + 15, { align: 'justify' });

      marginTop = marginTop + 30;
      genPdf.text(arr[i].descripcion, marginleftColumn2, marginTop, { align: 'left', maxWidth: 150 });

      marginTop = marginTop + 20;
      genPdf.text(`Operación: ${arr[i].referencia}`, marginleftColumn2, marginTop + 30, { align: 'justify' });
      genPdf.text("Observaciones:", marginleftColumn2, marginTop + 45, { align: 'justify', maxWidth: 200 });
      genPdf.text(arr[i].notas ? arr[i].notas : " ", marginleftColumn2, marginTop + 60, { align: 'justify', maxWidth: 180 });

      marginTop = marginTop + 30;
      autoTable(genPdf, {
        body: [
          [`Núcleo: ${nucleoDetalle.description}`, `Número:${nucleoDetalle.number}`],
        ],
        tableWidth: 400,
        startY:marginTop +100,
        margin: [10, 10, 10, 100],
        styles: { fontSize: 10 }

      });
      
      if (arr[i+1]) {
        genPdf.addPage("A4");
      }
    };


    genPdf.save();


  }

  generateArrDetalle(arr: MovContDet[]): Array<any> {

    let body: Array<any> = [];
    let total = 0;
    // running array obj
    for (let i = 0; i < arr.length; i++) {
      total = total + arr[i].importe;
      let string1 = arr[i].mespago.slice(0, 4);
      let string2 = arr[i].mespago.slice(4, 6);
      let periodo = string1.concat("-", string2);
      let final: Array<any> = [];
      final.push(periodo);
      final.push(new Intl.NumberFormat("de-DE", { minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(arr[i].importe));
      body.push(final);
    }
    body.push(["Total", new Intl.NumberFormat("de-DE", { minimumIntegerDigits: 1, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)]);
    return body;
  }

  getCantDetail(arr: MovContDet[]): number {
    let total: number = 0;
    for (let i = 0; i < arr.length; i++) {
      total = total + arr[i].cantidad;
    }

    return total;
  }
  getTotalDetail(arr: MovContDet[]): number {
    let total: number = 0;
    for (let i = 0; i < arr.length; i++) {
      total = total + arr[i].importe;
    }

    return total;
  }
  getNucleo(arr: MovContDet[]): INucleos {
    let number = 0;
    let description ="";
    if (arr[0]) {
      number = arr[0].nucleo.id;
      description = arr[0].nucleo.nombre;
    } 
    return { description: description, number: number };
  }

  getDate(date: string): Array<string> {
    let final: Array<string> = [];
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    final = [day, month, year]
    return final;
  }

}
