import { Component, OnInit } from '@angular/core';
import { MovCont } from '../../models/movcont';
import { Via } from '../../../Admin/models/via';
import { Moneda } from '../../../Admin/models/moneda';
import { BcoMov } from '../../models/bcomov';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { MonedaService } from '../../../Admin/services/moneda.service';
import { MovcontService } from '../../serv/movcont.service';
import { Location, formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otro-alta',
  templateUrl: './otro-alta.component.html',
  styleUrls: ['./otro-alta.component.css']
})
export class OtroAltaComponent implements OnInit {

  objRec: MovCont = new MovCont();
  varsVia: Via[];
  lavia: Via = new Via();
  vavia = true;
  varsMon: Moneda[];
  lamon: Moneda = new Moneda();
  varsSigno = ['Ingreso', 'Salida'];
  elsigno = '';
  closeResult = '';
  fechoy = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';


  indi = '';

  constructor(
    private viasrv: ViapagoService,
    private monsrv: MonedaService,
    private movsrv: MovcontService,
    private _location: Location
  ) {
  }

  ngOnInit() {
    this.viasrv.getVias().subscribe(
      resvia => {
        this.varsVia = resvia;
        this.lavia = this.varsVia[0];
        this.vavia = true;
        // if (sessionStorage.getItem('gasto_viaId') != null &&
        //     sessionStorage.getItem('gasto_viaId') != undefined) {
        //     let idvia = parseInt(sessionStorage.getItem('gasto_viaId'), 10);
        //     if (idvia != 0) {
        //       for (const vivi of this.varsVia) {
        //         if (vivi.id == idvia) {
        //           this.lavia = vivi;
        //           this.objRec.viapago = this.lavia;
        //           this.vavia = false;
        //           break;
        //         }
        //       }
        //     }
        // }

        this.elsigno = this.varsSigno[0];
        this.objRec.recibo = 0; //this.lavia.proximo;
        // if (sessionStorage.getItem('gasto_fecha') != null &&
        //     sessionStorage.getItem('gasto_fecha') != undefined) {
        //     this.fechoy = sessionStorage.getItem('gasto_fecha');
        // } else {
          this.fechoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
        // }

        this.objRec.descripcion = ''; //sessionStorage.getItem('gasto_desc');
        this.objRec.referencia = ''; //sessionStorage.getItem('gasto_refe');
        // if (sessionStorage.getItem('gasto_movId') !=  null &&
        //     sessionStorage.getItem('gasto_movId') !== undefined) {
        //     this.bcomovsrv.getMovBco(sessionStorage.getItem('gasto_movId')).subscribe(
        //     resmov => {
        //       this.objBcoMov = resmov;
        //       this.haymov = true;
        //     }
        //   );
        // }

        this.objRec.signo = 1;
        this.objRec.importe = 0;

        // if (sessionStorage.getItem('gasto_importe') !=  null &&
        //     sessionStorage.getItem('gasto_importe') !== undefined) {
        //       this.objRec.signo = -1;
        //       this.objRec.importe = parseInt(sessionStorage.getItem('gasto_importe'), 10);
        // }
        this.objRec.detalle = [];
      }
    );
    this.monsrv.getMonedas().subscribe(
      resmon => {
        this.varsMon = resmon;
        this.lamon  = this.varsMon[0];
      }
    );
  }

  onChangeVia(mellega){
    console.log(mellega);
    for (const vivi of this.varsVia) {
      if (vivi.nombre.trim() == mellega.trim()){
        this.lavia = vivi;
  //      this.objRec.recibo = this.lavia.proximo;
        break;
      }
    }
  }

  onChangeSigno(mesigo){
    console.log(mesigo);
    for (const sisi of this.varsSigno) {
      if (sisi.trim() == mesigo.trim()){
        this.elsigno = mesigo;
        break;
      }
    }
  }

  onChangeMon(mellega){
    console.log(mellega);
    for (const momo of this.varsMon) {
      if (momo.simbolo.trim() == mellega.trim()){
        this.lamon = momo;
        this.objRec.mon = this.lamon;
        break;
      }
    }
  }

  /// ------------------- Validacion y creacion del formulario


  crearRecibo(f: NgForm) {
    if (this.objRec.descripcion == null || this.objRec.descripcion === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar una descripción';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (this.objRec.importe === 0) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Importe del gasto en cero';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.grabo();
  }

  grabo() {
    let anio = parseInt(this.fechoy.substr(0, 4), 10);
    let mes = parseInt(this.fechoy.substr(5, 2), 10);
    let dia = parseInt(this.fechoy.substr(8, 2), 10);
    this.objRec.fecha = new Date(anio, mes-1, dia);

    this.objRec.tipo = "P";
    this.objRec.signo = 1;
    if (this.elsigno = 'Salida') {
      this.objRec.tipo = "N";
      this.objRec.signo = -1;
    }

    this.objRec.viapago = this.lavia;
    this.objRec.mon = this.lamon;
    this.movsrv.saveMovcont(this.objRec).subscribe(
      resdat => {
        this.objRec = resdat;
        this.msgok();
      },
      error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear el Gasto';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
      }
    );
  }

  msgok(){
    this.swaltit = 'Ok';
    this.swalmsg = 'El movimiento fue creado correctamente';
    Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
    });
    this.volver();
  }

  volver() {
      this._location.back();
  }


}
