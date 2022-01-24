import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { TipoCarga } from '../../models/tipo-carga';
import { TipoEstanteria } from '../../models/tipo-estanteria';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-tipo-estanteria-data',
  templateUrl: './tipo-estanteria-data.component.html',
  styleUrls: ['./tipo-estanteria-data.component.css']
})
export class TipoEstanteriaDataComponent implements OnInit {

  tipoEstanteriaId: string | null = 'null';
  esAlta = false;
  testanteria = new TipoEstanteria();
  titulo = '';
  mode: string | null = '';
  visor = false;
  tiposCarga: TipoCarga[] = [];
  tipoCargaSeleccionado!: TipoCarga ;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.tipoEstanteriaId = params.get('id');
        this.mode = params.get('mode');
        console.log(this.tipoEstanteriaId + '//' + this.mode);
        if (this.tipoEstanteriaId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de tipo de estanterìa';
          this.getTiposCarga('');
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de tipo de estanterìa';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de tipo de estanterìa';
            this.visor = true;
          }
          if (this.tipoEstanteriaId != null) {
            this.matser.getTipoDeEstanteria(this.tipoEstanteriaId).subscribe(
              resu => {
                console.log('el resu vale');
                console.log(resu);
                if (resu.error) {
                  Swal.fire({
                    title: resu.error,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                  this.volver();
                } else {
                  this.testanteria = resu.object;
                  console.log(this.testanteria);
                  this.getTiposCarga(this.testanteria.lotyId);
                }
              }, error => {
                console.log('Por el error');
                console.log(error);
                Swal.fire({
                  title: 'Error al cargar el tipo de estanterìa',
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

  getTiposCarga(tipoCargaId: string) {
    this.matser.getTiposDeCarga().subscribe(
      resu => {
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar cargar los tipos de carga',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.tiposCarga = resu.object;
          if (tipoCargaId != '') {
            console.log('a cargar el que estaba');
            for (let tc of this.tiposCarga) {
              if (tc.id == tipoCargaId) {
                console.log('voy a cargar ' + tc.dsc);
                this.tipoCargaSeleccionado = tc;
              }
            }
          } else {
            this.tipoCargaSeleccionado = this.tiposCarga[0];
          }
        }
      }, error => {
        Swal.fire({
          title: 'Error al cargar los tipos de carga',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  sendTipoEstanteria(f: NgForm) {
    console.log('a grabar te ' + this.tipoCargaSeleccionado.id);
    this.testanteria.lotyId = this.tipoCargaSeleccionado.id;
    console.log(this.testanteria);
    if (this.controlo()) {
      if (this.esAlta) {
        this.matser.getTipoDeEstanteria(this.testanteria.id).subscribe(
          resu => {
            if (resu.error) {
              this.teGrabo();
            } else {
              Swal.fire({
                title: 'Ya existe el tipo de estantería',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          }, error => {
            Swal.fire({
              title: 'Error al controlar si existe el tipo de estantería',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } else {
        this.teGrabo();
      }
    }
  }

  teGrabo() {
    this.matser.setTipoEstanteria(this.testanteria).subscribe(
      resu => {
        console.log('el resultado de la cosa es');
        console.log(resu);
        let msg = '';
        if (this.esAlta) {
          msg = 'Tipo de estanterìa creada con exito';
          this.testanteria = new TipoEstanteria();
        } else {
          msg = 'Tipo de estanterìa modificada con exito';
        }
        Swal.fire({
          title: msg,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }, error => {
        console.log(error);
        console.log(error.error.error);
        let msg = '';
        if (this.esAlta) {
          msg = 'Error al intentar crear el tipo de estanterìa';
        } else {
          msg = 'Error al intentar editar el tipo de estanterìa';
        }
        Swal.fire({
          title: msg,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  controlo(): boolean {
    if (this.tipoCargaSeleccionado == null || this.tipoCargaSeleccionado == undefined) {
      Swal.fire({
        title: 'Debe ingresar tipo de carga',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
    if (this.testanteria.id == null || this.testanteria.id == undefined || this.testanteria.id == '') {
      Swal.fire({
        title: 'Debe ingresar id',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
    if (this.testanteria.dsc == null || this.testanteria.dsc == undefined || this.testanteria.dsc == '') {
      Swal.fire({
        title: 'Debe ingresar descripción',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
    let letras_mayusculas="ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
    console.log(letras_mayusculas.indexOf(this.testanteria.id));
    // return false;
    if (letras_mayusculas.indexOf(this.testanteria.id) == -1 ) {
      Swal.fire({
        title: 'El id debe ser una letra mayúscula',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    return true;
  }

  volver() {
    this.location.back();
  }
}
