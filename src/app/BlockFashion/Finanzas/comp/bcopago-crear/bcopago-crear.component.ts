import { Component, OnInit } from '@angular/core';
import { BcoPago } from '../../models/bcopago';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { MonedaService } from '../../../Admin/services/moneda.service';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { PagbcoService } from '../../serv/pagbco.service';
import { Location, formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Via } from '../../../Admin/models/via';

@Component({
  selector: 'app-bcopago-crear',
  templateUrl: './bcopago-crear.component.html',
  styleUrls: ['./bcopago-crear.component.css']
})
export class BcopagoCrearComponent implements OnInit {

  objRec: BcoPago = new BcoPago();
  closeResult = '';
  fechoy = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  varsVia: Via[];
  lavia: Via = new Via();
  objNuc: Nucleo = new Nucleo();
  objAfi: Afiliado = new Afiliado();
  nucId = 1;
  afiId = '';
  indi = '';

  constructor(
    private viasrv: ViapagoService,
    private monsrv: MonedaService,
    private nucsrv: NucleosService,
    private afisrv: AfiliadosService,
    private movsrv: PagbcoService,
    private actRout: ActivatedRoute,
    private _location: Location
  ) {
  }

  ngOnInit() {
    this.fechoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.varsVia = [];
    this.viasrv.getVias().subscribe(
       resvia => {
         this.varsVia = resvia;
         this.lavia = this.varsVia[0];
      }
    );
    // this.monsrv.getMonedas().subscribe(
    //   resmon => {
    //   }
    // );
    this.objRec.importe = 0;
    this.nucId = this.actRout.snapshot.params['idNuc'];
    this.afiId = this.actRout.snapshot.params['idAfi'];
    if (this.afiId == null || this.afiId === undefined) {
      this.afiId = '';
      if (this.nucId != 1) {
        this.swaltit = 'Atención';
        this.swalmsg = 'No se definio cedula para nucleo 1';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
        });
        this.volver();
      }
    }
    this.nucsrv.getNucleo(this.nucId.toString()).subscribe(
      renu => {
        this.objNuc = renu;
      }
    );
    if (this.nucId == 1) {
      this.afisrv.getAfiliado(this.afiId).subscribe(
        reaf => {
          this.objAfi = reaf;
        }
      );
    }

  }

  onChangeVia(mellega){
    console.log(mellega);
    for (const vivi of this.varsVia) {
      if (vivi.nombre.trim() == mellega.trim()){
        this.lavia = vivi;
        this.objRec.via = this.lavia;
        break;
      }
    }
  }

  // onChangeMon(mellega){
  //   console.log(mellega);
  //   for (const momo of this.varsMon) {
  //     if (momo.simbolo.trim() == mellega.trim()){
  //       this.lamon = momo;
  //       this.objRec.mon = this.lamon;
  //       break;
  //     }
  //   }
  // }

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
    if (this.objRec.via == null || this.objRec.via == undefined || this.objRec.via.id == 1) {
      this.swaltit = 'Atención';
      this.swalmsg = 'La via de pago debe ser banco o redpagos';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (parseInt(this.objRec.importe.toString(),10) == 0) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Importe del pago en cero';
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
    this.objRec.banco = "BROU";
    if (this.nucId != 1){
      this.objRec.afiliado = null;
    } else {
      this.objRec.afiliado = this.objAfi;
    }

    this.objRec.nucleo = this.objNuc;
    this.objRec.estado = ' ';
    this.objRec.movcont = null;

    console.log(this.objRec);
    this.movsrv.savePagoBco(this.objRec).subscribe(
      resdat => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El pago fue creado correctamente'
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear el pago';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }
    volver() {
      this._location.back();
    }


}
