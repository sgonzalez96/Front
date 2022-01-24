import { Component, OnInit } from '@angular/core';
import { BcoPago } from '../../models/bcopago';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { PagbcoService } from '../../serv/pagbco.service';
import { ActivatedRoute } from '@angular/router';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { formatDate, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bcopago-editar',
  templateUrl: './bcopago-editar.component.html',
  styleUrls: ['./bcopago-editar.component.css']
})
export class BcopagoEditarComponent implements OnInit {

  objRec: BcoPago = new BcoPago();
  closeResult = '';
  fechoy = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  objNuc: Nucleo = new Nucleo();
  objAfi: Afiliado = new Afiliado();
  nucId = 1;
  afiId = '';
  indi = '';

  constructor(
    private movsrv: PagbcoService,
    private actRout: ActivatedRoute,
    private _location: Location
  ) {
  }

  ngOnInit() {

    // this.viasrv.getVias().subscribe(
    //   resvia => {
    //   }
    // );
    // this.monsrv.getMonedas().subscribe(
    //   resmon => {
    //   }
    // );
    let laid = this.actRout.snapshot.params['id'];
    console.log(laid);
    this.movsrv.getPagoBco(laid).subscribe(
      resrec => {
        this.objRec = resrec;
        console.log("aca estamos");
        console.log(this.objRec);
        this.fechoy = formatDate(this.objRec.fecha, 'yyyy-MM-dd',"en-US");
        //this.fechoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
        this.objNuc = this.objRec.nucleo;
        this.nucId = this.objNuc.id;
        console.log("y pasamos");
        if (this.nucId == 1) {
          this.objAfi = this.objRec.afiliado;
          this.afiId = this.objAfi.cedula;

        } else {
          this.afiId = '';
          this.objAfi = null;
        }


      }, error => {
        this.swaltit = 'Atención';
        this.swalmsg = 'Error en parametros';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
        });
        this.volver();
      }
    );
  }


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
        this.swalmsg = 'El pago fue modificado correctamente';
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
