import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Moneda } from '../../models/moneda';
import { MonedaService } from '../../services/moneda.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mon-editar',
  templateUrl: './mon-editar.component.html',
  styleUrls: ['./mon-editar.component.css']
})
export class MonEditarComponent implements OnInit, OnDestroy {

  pageSettings = pageSettings;
  objMon = new Moneda();
  swaltit: string;
  swalmsg: string;

  constructor(private monsrv: MonedaService,
              private actRout: ActivatedRoute,
              private _location: Location) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.actRout.paramMap.subscribe(
      params => {
        let idMon = params.get('id');
        this.monsrv.getMoneda(idMon).subscribe(
          resu => {
            this.objMon = resu;
          }
        );
      }
    );
  }


  creoMon(f: NgForm) {
    if (this.objMon.descripcion == null || this.objMon.descripcion === '') {
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

    this.monsrv.saveMoneda(this.objMon).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'La moneda fue modificada correctamente';
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
          this.swalmsg = 'Error al crear la moneda';
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
