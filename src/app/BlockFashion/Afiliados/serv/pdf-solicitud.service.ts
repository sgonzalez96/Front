import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AfiliadosService } from './afiliados.service';
import { Afiliado } from '../models/afiliado';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class PdfSolicitudService {

  objAfi: Afiliado;

  constructor(private afisrv: AfiliadosService) { }

  generatePdf(objAfil: Afiliado) {
    this.objAfi = objAfil;
    const hoy = formatDate(new Date(), "dd/MM/yyyy", "en-US")

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // {
    //   image: '/assets/img/logo/cabezal.PNG'
    // },

    const documentDefinition = { content: [

            { text: 'Departamento: [' + this.objAfi.txtdepto.trim() + ']',
            },
            { text: 'Fecha: ' + hoy,
              alignment: 'right',
              lineHeight: 2
            },
            
            { text: 'Cpro/a Secretario/a General de SINTEP:',
              lineHeight: 2},
            { text: 'Solicito por la presente, se me admita como afiliado/a de SINTEP, declarando asimismo estar de acuerdo con el estatuto del sindicato.',
            lineHeight: 2},
            { text: 'Lo saluda atentamente,',
            lineHeight: 2},
            { text: 'Firma: _______________________________',
              alignment: 'right',
              lineHeight: 2},

          ]
        };
        pdfMake.createPdf(documentDefinition).open();
        return;
   }

}
