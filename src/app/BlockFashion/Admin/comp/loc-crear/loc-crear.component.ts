import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';

import { Ciudad } from '../../models/ciudad';
import pageSettings from '../../../../config/page-settings';
import { Localidad } from '../../models/localidad';
import { CiudadService } from '../../services/ciudad.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loc-crear',
  templateUrl: './loc-crear.component.html',
  styleUrls: ['./loc-crear.component.css']
})
export class LocCrearComponent implements OnInit, OnDestroy {
  @Input() ciudad: Ciudad;
  @Output() localidadChange = new EventEmitter();
  @Output() winLChange = new EventEmitter();
  @Output() winLClose = new EventEmitter();

  pageSettings = pageSettings;
  objLoc = new Localidad();
  swaltit: string;
  swalmsg: string;

  constructor(private ciudsrv: CiudadService,
              private actRout: ActivatedRoute) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
  }


  creoLoc(f: NgForm) {
    if (this.objLoc.nombre == null || this.objLoc.nombre === '') {
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
    this.objLoc.ciud = this.ciudad;
    this.ciudsrv.saveLocalidad(this.objLoc).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'La localidad fue creada correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.localidadChange.emit(resul);
        this.winLChange.emit('');
        
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear la localidad';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }


  d(conc){
    this.winLClose.emit('');
  }

}
