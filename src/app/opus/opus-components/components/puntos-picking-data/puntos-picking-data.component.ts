import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { PuntoPicking } from '../../models/punto-picking';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-puntos-picking-data',
  templateUrl: './puntos-picking-data.component.html',
  styleUrls: ['./puntos-picking-data.component.scss']
})
export class PuntosPickingDataComponent implements OnInit {

  ppId: string | null = 'null';
  esAlta = false;
  ppicking = new PuntoPicking();
  titulo = '';
  mode: string | null = '';
  visor = false;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.ppId = params.get('id');
        this.mode = params.get('mode');
        if (this.ppId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de punto de picking';
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de punto de picking';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de punto de picking';
            this.visor = true;
          }
          if (this.ppId != null) {
            console.log('el pp valeeeeeeee ' + this.ppId);
            this.matser.getPuntoPicking(this.ppId).subscribe(
              resu => {
                console.log(resu);
                if (resu.error) {
                  Swal.fire({
                    title: 'Error al cargar el punto de picking',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                  this.volver();
                } else {
                  this.ppicking = resu.object;
                  console.log('el resu valeeeeee');
                  console.log(this.ppicking);
                }
              }, error => {
                console.log('Por el error');
                console.log(error);
                Swal.fire({
                  title: 'Error al cargar el punto de picking',
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

  sendPuntoPicking(f: NgForm) {
    console.log('a grabar pp');
    console.log(this.ppicking);
    if (f.valid) {
      this.matser.setPuntoPicking(this.ppicking).subscribe(
        resu => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Punto de picking creado con exito';
            this.ppicking = new PuntoPicking();
          } else {
            msg = 'Punto de picking modificado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Error al intentar crear el punto de picking';
          } else {
            msg = 'Error al intentar editar el punto de picking';
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
