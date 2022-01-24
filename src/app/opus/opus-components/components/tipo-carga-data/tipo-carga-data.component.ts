import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { TipoCarga } from '../../models/tipo-carga';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-tipo-carga-data',
  templateUrl: './tipo-carga-data.component.html',
  styleUrls: ['./tipo-carga-data.component.scss']
})
export class TipoCargaDataComponent implements OnInit {

  tipoCargaId: string  | null = 'null';
  esAlta = false;
  tcarga = new TipoCarga();
  titulo = '';
  mode: string  | null = '';
  visor = false;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.tipoCargaId = params.get('id');
        this.mode = params.get('mode');
        if (this.tipoCargaId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de tipo de carga';
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de tipo de carga';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de tipo de carga';
            this.visor = true;
          }
          if (this.tipoCargaId != null) {
            this.matser.getTipoDeCarga(this.tipoCargaId).subscribe(
            resu => {
              console.log(resu);
              if (resu.error || resu.object == null) {
                Swal.fire({
                  title: 'Error al cargar el tipo de carga',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
                });
                this.volver();
              } else {
                this.tcarga = resu.object;
                console.log(this.tcarga)
              }
            }, error => {
              console.log('Por el error');
              console.log(error);
              Swal.fire({
                title: 'Error al cargar el tipo de carga',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              this.volver();
            }
          );
          }
          
        }
      });
  }

  sendTipoCarga(f: NgForm) {
    console.log('a grabar tc');
    console.log(this.tcarga);
    if (f.valid) {
      this.matser.setTipoCarga(this.tcarga).subscribe(
        resu => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Tipo de carga creada con exito';
            this.tcarga = new TipoCarga();
          } else {
            msg = 'Tipo de carga modificada con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Error al intentar crear el tipo de carga';
          } else {
            msg = 'Error al intentar editar el tipo de carga';
          }
          Swal.fire({
            title: msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Debe ingresar descripción',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  volver() {
    this.location.back();
  }

}
