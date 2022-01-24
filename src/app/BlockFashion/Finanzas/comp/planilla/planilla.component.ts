import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { MovCont } from '../../models/movcont';
import { Via } from '../../../Admin/models/via';
import { MovcontService } from '../../serv/movcont.service';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css']
})
export class PlanillaComponent implements OnInit {

  pageSettings = pageSettings;
  listamov: MovCont[];
  lista: MovDTO[];
  objMov: MovCont;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  objDato: Dato;
  fecini = '';
  fecfin = '';
  varsOpcion: Via[];
  lavia: Via = new Via();

  varsModo = ['0-Todo','1-Recibos','2-Gastos','3-Otros'];
  elmodo = '';

  saldo = 0;

  constructor(
    private movsrv: MovcontService,
    private viasrv: ViapagoService,
    private excsrv: ExceljsService,
    private datsrv: DatosService,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.elmodo = this.varsModo[0]
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.fecfin = this.fecini;
    let lavia: Via = new Via();
    lavia.nombre = 'Todas los vías de pago';
    lavia.id = 0;
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );

    this.varsOpcion = [];
    this.varsOpcion.push(lavia);
    this.viasrv.getVias().subscribe(
      restip => {
        for (const otipo of restip) {
          this.varsOpcion.push(otipo);
        }
        this.lavia = this.varsOpcion[0];
        this.getOrigen();
      }
    );
  }

  getOrigen() {
    sessionStorage.removeItem('gasto_viaId');
    sessionStorage.removeItem('gasto_fecha');
    sessionStorage.removeItem('gasto_desc');
    sessionStorage.removeItem('gasto_refe');
    sessionStorage.removeItem('gasto_movId');
    sessionStorage.removeItem('gasto_pagoId');

    let pepe = '';
    pepe = sessionStorage.getItem('listagas_via');
    if (pepe != null && pepe != undefined){
      for (const vivi of this.varsOpcion){
        if (vivi.id == parseInt(pepe,10)){
          this.lavia = vivi;
          break;
        }
      }
    }

    let pepi = '';
    pepi = sessionStorage.getItem('listagas_feci');
    if (pepi != null && pepi != undefined){
      this.fecini = pepi;
    }

    let pepf = '';
    pepf = sessionStorage.getItem('listagas_fecf');
    if (pepf != null && pepf != undefined){
      this.fecfin = pepf;
    }
    this.cargo();

  }

  cargo() {
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.lista = [];
    sessionStorage.setItem('listagas_via', this.lavia.id.toString());
    sessionStorage.setItem('listagas_feci', this.fecini);
    sessionStorage.setItem('listagas_fecf', this.fecfin);
    let letrini = ' ';
    let letrfin = 'z';
    if (this.elmodo.substr(0,1) === '1') {
      letrini = 'R';
      letrfin = 'R';
    } else if (this.elmodo.substr(0,1) === '2') {
      letrini = 'G';
      letrfin = 'G';
    }  else if (this.elmodo.substr(0,1) === '3') {
      letrini = 'N';
      letrfin = 'P';
    }
    //console.log("por aca " , this.lavia.id , "*",this.fecini,this.fecfin,"**",letrini,letrfin);
    this.movsrv.getSaldo(this.lavia.id.toString(), this.fecini).subscribe(
      resaldo => {
        this.saldo = resaldo;

          if (this.lavia.id === 0) {
            this.movsrv.getMovs(this.fecini, this.fecfin, letrini, letrfin).subscribe(
              resmon => {

                this.listamov = resmon;
                this.pasolista();
                Swal.close();
              }
            );
          } else {
            sessionStorage.setItem('gasto_viaId',this.lavia.id.toString());
            this.movsrv.getMovsVia(this.fecini, this.fecfin, this.lavia.id.toString(), letrini, letrfin).subscribe(
              resmon => {
                //console.log("me llega ");
                //console.log(resmon);
                this.listamov = resmon;
                this.pasolista();
                Swal.close();
              }
            );
          }
      }
    );

  }

  pasolista() {
    let acumulado = this.saldo;
    let impo = 0;
    console.log("para booo " + this.saldo + "-" + acumulado + "-" + impo);
    for (const unmov of this.listamov) {
      let movdto = new MovDTO;
      movdto.id = unmov.id;
      movdto.fecha = unmov.fecha;
      movdto.recibo = unmov.recibo.toString();
      movdto.referencia = unmov.referencia;
      movdto.tipo = 'Gasto';
      if (unmov.tipo === 'R') {
        movdto.tipo = 'Recibo';
      } else if (unmov.tipo === 'O') {
        movdto.tipo = 'Otros';
      }
      movdto.descripcion = unmov.descripcion;
      movdto.via = unmov.viapago.nombre;
      impo = unmov.importe * unmov.signo;
      acumulado = acumulado + impo;
      movdto.importe = impo;
      movdto.saldo = acumulado;
      this.lista.push(movdto);
    }

  }
  onChangeTipo(uno){
    for (const pipi of this.varsOpcion){
      if (uno.trim() === pipi.nombre.trim()) {
        this.lavia = pipi;
        if (this.lavia.id == 0){
          sessionStorage.removeItem('gasto_viaId');
        } else {
          sessionStorage.setItem('gasto_viaId',this.lavia.id.toString());
        }
        break;
      }
    }
  }

  onChangeModo(dos){
    this.elmodo = dos;
    //console.log(this.elmodo);
  }


  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {
      lisXls.push([
        this.lista[i].fecha ,
        this.lista[i].recibo ,
        this.lista[i].descripcion ,
        this.lista[i].via,
        this.lista[i].referencia ,
        this.lista[i].tipo ,
        this.lista[i].importe ,
        this.lista[i].saldo
      ]);
    }

    const pHeader = ["Fecha","Recibo","Descripcion","Via","Referencia","Tipo","Importe","Saldo"];
    const pCol = [10, 10,40,25,25,15,15,15]

    const pTit = 'Planilla contable';
    const pSubtit = 'Saldo inicial = ' + this.saldo + 'para ' + this.lavia.nombre;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

}

export class MovDTO {
  id: number;
  fecha: Date;
  recibo: string;
  descripcion: string;
  via: string;
  referencia: string;
  tipo: string;
  importe: number;
  saldo: number;
}
