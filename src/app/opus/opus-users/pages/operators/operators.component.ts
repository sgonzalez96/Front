import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatricerosService } from '../../../opus-components/services/matriceros.service';
import { Operator } from '../../models/operator';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {

  list: Operator[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getOperators().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        this.list = resu;
      }, error => {
        console.log('error en el findall');
        console.log(error);
        Swal.fire({
          title: 'Error al intentar cargar los operadores',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createOperator() {
    this.router.navigate(['/user/operator-data/null/M']);
  }

  operatorData(operator: Operator, modo: string) {
    console.log('edit');
    console.log(operator);
    this.router.navigate(['/user/operator-data/', operator.operatorId, modo]);
  }

  cambioEstado(habilito: boolean, operId: number) {
    // En un futuro puedo controlar que no tenga pedidos y si los tiene avisar (si voy a deshabilitar)
    if (!habilito) {
      Swal.fire({
        title: 'Seguro desea inhabilitar el operario?',
        text: 'el operador puede tener separaciones en curso!!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log(result)
        if (result.value) {
          this.teCambioEstado(habilito, operId);
        } else {
          console.log('cancele');
        }
      });
    } else {
      Swal.fire({
        title: 'Seguro desea habilitar el operario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log(result)
        if (result.value) {
          this.teCambioEstado(habilito, operId);
        } else {
          console.log('cancele');
        }
      });
    }
  }

  teCambioEstado(habilito: boolean, operId: number) {
    this.matser.changeOperatorState(operId, habilito).subscribe(
      resu => {
        console.log(resu);
        if (resu) {
          let msg = '';
          if (habilito) {
            msg = 'Operario habilitado con exito';
          } else {
            msg = 'Operario deshabilitado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.initData();
        } else {
          Swal.fire({
            title: 'Error al intentar deshabilitar el operario',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar deshabilitar el operario',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
