import { Component, OnInit } from '@angular/core';
import { MovCont } from '../../models/movcont';
import { Via } from '../../../Admin/models/via';
import { Moneda } from '../../../Admin/models/moneda';
import { BcoMov } from '../../models/bcomov';
import { BcoPago } from '../../models/bcopago';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { MonedaService } from '../../../Admin/services/moneda.service';
import { MovcontService } from '../../serv/movcont.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, formatDate } from '@angular/common';
import { MovbcoService } from '../../serv/movbco.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gasto-alta',
  templateUrl: './gasto-alta.component.html',
  styleUrls: ['./gasto-alta.component.css']
})
export class GastoAltaComponent implements OnInit {

  objRec: MovCont = new MovCont();
  varsVia: Via[];
  lavia: Via = new Via();
  vavia = true;
  varsMon: Moneda[];
  lamon: Moneda = new Moneda();
  closeResult = '';
  fechoy = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  indi = '';

  haymov = false;
  haypago = false;
  objBcoMov: BcoMov = new BcoMov();
  objBcoPago: BcoPago = new BcoPago();

  constructor(
    private viasrv: ViapagoService,
    private monsrv: MonedaService,
    private modalService: NgbModal,
    private movsrv: MovcontService,
    private bcomovsrv: MovbcoService,
    private _location: Location
  ) {
  }

  ngOnInit() {
    this.viasrv.getVias().subscribe(
      resvia => {
        this.varsVia = resvia;
        this.lavia = this.varsVia[0];
        this.vavia = true;
        if (sessionStorage.getItem('gasto_viaId') != null &&
            sessionStorage.getItem('gasto_viaId') != undefined) {
            let idvia = parseInt(sessionStorage.getItem('gasto_viaId'), 10);
            if (idvia != 0) {
              for (const vivi of this.varsVia) {
                if (vivi.id == idvia) {
                  this.lavia = vivi;
                  this.objRec.viapago = this.lavia;
                  this.vavia = false;
                  break;
                }
              }
            }
        }


        this.objRec.recibo = this.lavia.proximo;
        if (sessionStorage.getItem('gasto_fecha') != null &&
            sessionStorage.getItem('gasto_fecha') != undefined) {
            this.fechoy = sessionStorage.getItem('gasto_fecha');
        } else {
          this.fechoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
        }

        this.objRec.descripcion = sessionStorage.getItem('gasto_desc');
        this.objRec.referencia =sessionStorage.getItem('gasto_refe');
        if (sessionStorage.getItem('gasto_movId') !=  null &&
            sessionStorage.getItem('gasto_movId') !== undefined) {
            this.bcomovsrv.getMovBco(sessionStorage.getItem('gasto_movId')).subscribe(
            resmov => {
              this.objBcoMov = resmov;
              this.haymov = true;
            }
          );
        }
        if (sessionStorage.getItem('gasto_importe') !=  null &&
            sessionStorage.getItem('gasto_importe') !== undefined) {
              this.objRec.signo = -1;
              this.objRec.importe = parseInt(sessionStorage.getItem('gasto_importe'), 10);
        }
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
        this.objRec.recibo = this.lavia.proximo;
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
    this.objRec.tipo = "G";
    this.objRec.signo = -1;
    this.objRec.viapago = this.lavia;
    this.objRec.mon = this.lamon;
    this.movsrv.saveMovcont(this.objRec).subscribe(
      resdat => {
        this.objRec = resdat;
        if (this.haymov) {
          this.gramov();
          } else {
          this.msgok();
          }
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
    // this.swaltit = 'Ok';
    // this.swalmsg = 'El gasto fue creado correctamente';
    // Swal.fire({
    //       title: this.swaltit,
    //       text: this.swalmsg,
    //       type: 'success',
    //       confirmButtonText: 'OK',
    // });
    this.volver();
  }

  gramov() {
    this.bcomovsrv.getMovBco(this.objBcoMov.id.toString()).subscribe(
      bcomov => {
        this.objBcoMov = bcomov;
        this.objBcoMov.estado = 'C';
        this.objBcoMov.movcont = this.objRec;
        this.bcomovsrv.saveMovBco(this.objBcoMov).subscribe(
          resoka => {
            this.msgok();
          }
        );
      }
    );
  }


  /// ------------------- Manejo de una liena de recibo --------------------------- \\\



    volver() {
      this._location.back();
    }


}
