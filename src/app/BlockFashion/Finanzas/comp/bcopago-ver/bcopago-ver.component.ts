import { Component, OnInit } from '@angular/core';
import { BcoPago } from '../../models/bcopago';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { PagbcoService } from '../../serv/pagbco.service';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bcopago-ver',
  templateUrl: './bcopago-ver.component.html',
  styleUrls: ['./bcopago-ver.component.css']
})
export class BcopagoVerComponent implements OnInit {

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


      volver() {
      this._location.back();
    }


}
