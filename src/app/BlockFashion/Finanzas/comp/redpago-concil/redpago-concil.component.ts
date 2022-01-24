import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { BcoMov } from '../../models/bcomov';
import { BcoPago } from '../../models/bcopago';
import { Dato } from '../../../Admin/models/dato';
import { MovbcoService } from '../../serv/movbco.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { PagbcoService } from '../../serv/pagbco.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-redpago-concil',
  templateUrl: './redpago-concil.component.html',
  styleUrls: ['./redpago-concil.component.css']
})
export class RedpagoConcilComponent implements OnInit {

  pageSettings = pageSettings;
  listamov: movsDTO[];
  objMov: BcoMov;
  objRec: BcoMov;

  listapago: pagosDTO[];
  listaini: BcoPago[];
  objPago: BcoPago;

  objDato: Dato;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  haysel = false;

  hayfec = true;
  hayfec5 = false;
  hayimpo = false;
  haydoc = true;

  closeResult = '';

  constructor(
    private movsrv: MovbcoService,
    private datsrv: DatosService,
    private pagosrv: PagbcoService,
    private excsrv: ExceljsService,
    private modalService: NgbModal
    ) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    sessionStorage.setItem('recibo_viaId','3');
    sessionStorage.removeItem('recibo_fecha');
    sessionStorage.removeItem('recibo_desc');
    sessionStorage.removeItem('notas');
    sessionStorage.removeItem('recibo_refe');
    sessionStorage.removeItem('recibo_movId');
    sessionStorage.removeItem('recibo_pagoId');

    this.listamov = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.fecfin = this.fecini;
    if (sessionStorage.getItem('concil_rpfeci') != null &&
        sessionStorage.getItem('concil_rpfecf') != undefined) {
        this.fecini = sessionStorage.getItem('concil_rpfeci');
        this.fecfin = sessionStorage.getItem('concil_rpfecf');
    }
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.cargo();
  }


  cargo() {

    this.listamov = [];
    this.listapago = [];
    sessionStorage.setItem('concil_rpfeci', this.fecini);
    sessionStorage.setItem('concil_rpfecf', this.fecfin);

    Swal.fire({
      title: 'Cargando informacion ... '
    });
    Swal.showLoading();

    this.movsrv.getMovs(this.fecini, this.fecfin, ' ', 'B', '3', '3').subscribe(
      resmov => {
        for (let coco  of resmov) {
          let papa: movsDTO = new movsDTO();
          papa.mov = coco;
          papa.selected = false;
          this.listamov.push(papa);
        }
        Swal.close();
      }, error => {
        console.log("errro");
        Swal.close();
      }
    );

    this.pagosrv.getPagos(this.fecini, this.fecfin, ' ', 'B','3','3').subscribe(
      respago => {
        this.listaini = respago;
        Swal.close();
      }, error => {
        console.log("errro");
        Swal.close();
      }
    );

  }

  cambio(indi){
    let mindi = 0;
    mindi = indi;
    this.haysel = false;
    sessionStorage.removeItem('recibo_fecha');
    sessionStorage.removeItem('recibo_desc');
    sessionStorage.removeItem('notas');
    sessionStorage.removeItem('recibo_refe');
    sessionStorage.removeItem('recibo_movId');
    if (this.listamov[mindi].selected) {
      this.listamov[mindi].selected = false;
    } else {
      this.listamov[mindi].selected = true;
    }

    let primero = 0;
    let listaid: number[] = [];
    for (let i = 0; i < this.listamov.length; i++){
      if (this.listamov[i].selected) {
        console.log("en selected " + i);
        listaid.push(this.listamov[i].mov.id);
        if (primero === 0) {
          primero = 1;
          this.objMov = this.listamov[i].mov;
          sessionStorage.setItem('recibo_fecha',
          formatDate(this.listamov[i].mov.fecha, 'yyyy-MM-dd',"en-US"));
          sessionStorage.setItem('recibo_desc', this.listamov[i].mov.descripcion);
          sessionStorage.setItem('notas', this.listamov[i].mov.asunto);
          sessionStorage.setItem('recibo_refe', this.listamov[i].mov.documento);

        } else {
          sessionStorage.setItem('recibo_desc', sessionStorage.getItem('recibo_desc') + '|' + this.listamov[i].mov.descripcion);
          sessionStorage.setItem('notas', sessionStorage.getItem('notas') +  '|' + this.listamov[i].mov.asunto);
          sessionStorage.setItem('recibo_refe', sessionStorage.getItem('recibo_refe') +  '|' +  this.listamov[i].mov.documento);
        }
      }
    }
    if (primero === 1) {
      sessionStorage.setItem('recibo_movId', listaid.toString());
      sessionStorage.setItem('notas', sessionStorage.getItem('notas') +  'Id contables: ' + listaid.toString());
      this.initSel();
    }
    console.log("mis recibos");
    console.log(sessionStorage.getItem('recibo_refe'));
  }

  cambioPago(indi){
    let mindi = 0;
    mindi = indi;
    for (let i = 0; i < this.listapago.length; i++) {

      if (i != mindi) {
        this.listapago[i].selected = false;
      }
    }
    if (!this.listapago[mindi].selected){
      sessionStorage.setItem('recibo_pagoId', this.listapago[mindi].pago.id.toString());
    } else {
      sessionStorage.removeItem('recibo_pagoId');
    }
  }

  initSel() {
    this.haysel = true;
    this.hayfec = true;
    this.hayfec5 = false;
    this.hayimpo = false;
    this.haydoc = true;
    sessionStorage.removeItem('recibo_pagoId');
    this.cargoDtoPago();
  }

  cargoDtoPago(){
    this.listapago = [];

    const lafecha = formatDate(this.objMov.fecha, 'yyyy-MM-dd',"en-US");
    const dia = parseInt(lafecha.substr(8,2),10);
    const mes = parseInt(lafecha.substr(5,2),10);
    const ani = parseInt(lafecha.substr(0,4),10);

    let fecmov = new Date();
    fecmov.setDate(dia);
    fecmov.setMonth(mes-1);
    fecmov.setFullYear(ani);
    let vafecini = fecmov;
    vafecini.setDate(vafecini.getDate() - 5) ;

    let fecmovf = new Date();
    fecmovf.setDate(dia);
    fecmovf.setMonth(mes-1);
    fecmovf.setFullYear(ani);
    let vafecfin = fecmovf; // this.objMov.fecha ;
    vafecfin.setDate(vafecfin.getDate() + 5) ;

    for (let caca  of this.listaini) {
      let esteva = true;
      if (this.hayfec) {
        if (caca.fecha != this.objMov.fecha) {
          esteva = false;
        }
      }
      if (this.hayfec5) {
        if (caca.fecha < vafecini || caca.fecha > vafecfin ) {
          esteva = false;
        }
      }
      if (this.haydoc) {
        if (caca.referencia != this.objMov.documento ) {
          esteva = false;
        }
      }
      if (this.hayimpo) {
        if (caca.importe < this.objMov.credito - 1 || caca.importe > this.objMov.credito + 1 ) {
          esteva = false;
        }
      }
      if (esteva){
        let pepa: pagosDTO = new pagosDTO();
        pepa.pago = caca;
        pepa.selected = false;
        this.listapago.push(pepa);
      }
    }
  }

  activo(indice) {
    let indi = 0;
    indi = indice;
    if (indi == 0) {
      this.hayfec = true;
      this.hayfec5 = false;
    } else if (indi == 1) {
      this.hayfec = false;
      this.hayfec5 = true;
    } else if (indi == 2) {
      this.hayimpo = true;
    } else if (indi == 3) {
      this.haydoc = true;
    }
    this.cargoDtoPago();
  }

  apago(indice) {
    let indi = 0;
    indi = indice;
    if (indi == 0) {
      this.hayfec = false;
    } else if (indi == 1) {
      this.hayfec5 = false;
    } else if (indi == 2) {
      this.hayimpo = false;
    } else if (indi == 3) {
      this.haydoc = false;
    }
    this.cargoDtoPago();
  }


  // Para ver mov bco
  mov_open(content,item) {
    this.objRec = item.mov;

    this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  // Para ver mov bco
  pago_open(content,item) {
  this.objPago = item.pago;

  this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }



}

export class movsDTO{
  mov: BcoMov;
  selected: boolean;
}

export class pagosDTO{
  pago: BcoPago;
  selected: boolean;
}

