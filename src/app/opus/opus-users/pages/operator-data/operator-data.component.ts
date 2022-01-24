import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { MatricerosService } from 'src/app/opus/opus-components/services/matriceros.service';
import { Operator } from '../../models/operator';

@Component({
  selector: 'app-operator-data',
  templateUrl: './operator-data.component.html',
  styleUrls: ['./operator-data.component.scss']
})
export class OperatorDataComponent implements OnInit {

  opeId: string | null = 'null';
  esAlta = false;
  operator: Operator = new Operator();
  titulo = '';
  mode: string | null = '';
  visor = false;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.opeId = params.get('id');
        this.mode = params.get('mode');
        if (this.opeId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de operario';
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de operario';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de operario';
            this.visor = true;
          }
          if (this.opeId != null) {
            this.matser.getOperator(+this.opeId).subscribe(
              resu => {
                console.log(resu);
                this.operator = resu;
              }, error => {
                console.log('Por el error');
                console.log(error);
                Swal.fire({
                  title: 'Error al cargar el operario',
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

  sendOperator(f: NgForm) {
    console.log('a grabar operario');
    console.log(this.operator);
    if (f.valid) {
      if (this.esAlta) {
        this.operator.enabled = true;
      }
      this.matser.setOperator(this.operator).subscribe(
        resu => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Operario creado con exito';
            this.operator = new Operator();
          } else {
            msg = 'Operario modificado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Error al intentar crear el operario';
          } else {
            msg = 'Error al intentar editar el operario';
          }
          Swal.fire({
            title: msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }

  volver() {
    this.location.back();
  }

}
