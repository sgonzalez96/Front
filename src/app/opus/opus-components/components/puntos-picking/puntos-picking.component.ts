import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PuntoPicking } from '../../models/punto-picking';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-puntos-picking',
  templateUrl: './puntos-picking.component.html',
  styleUrls: ['./puntos-picking.component.scss']
})
export class PuntosPickingComponent implements OnInit {

  list: PuntoPicking[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getPuntosPicking().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar cargar los puntos de picking',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.list = [];
        } else {
          this.list = resu.object;
        }
      }, error => {
        console.log('error en el findall');
        console.log(error);
        Swal.fire({
          title: 'Error al intentar cargar los puntos de picking',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createPuntoPicking() {
    this.router.navigate(['/gral/puntos-picking-data/null/M']);
  }

  editPuntoPicking(puntoPicking: PuntoPicking, modo: string) {
    console.log('edit');
    console.log(puntoPicking);
    this.router.navigate(['/gral/puntos-picking-data/', puntoPicking.pointId, modo]);
  }

  deletePuntoPicking(ppc: string) {
    // En un futuro puedo controlar que no tenga pedidos y si los tiene avisar (si voy a deshabilitar)
    Swal.fire({
      title: 'Seguro desea eliminar el punto de picking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teElimino(ppc);
      } else {
        console.log('cancele');
      }
    });
  }

  teElimino(ppc: string) {
    this.matser.delPuntoPicking(ppc).subscribe(
      resu => {
        console.log(resu)
        if (resu.error || resu.object == null) {
          Swal.fire({
            title: 'Error al intentar eliminar el punto de picking',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          if (resu.object) {
            Swal.fire({
              title: 'Punto de picking elinada con exito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.initData();
          } else {
            Swal.fire({
              title: 'Error al intentar eliminar el punto de picking',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      }, error => {
        Swal.fire({
          title: 'Error al intentar eliminar el punto de picking',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
