import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoEstanteria } from '../../models/tipo-estanteria';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-tipo-estanteria',
  templateUrl: './tipo-estanteria.component.html',
  styleUrls: ['./tipo-estanteria.component.scss']
})
export class TipoEstanteriaComponent implements OnInit {

  list: TipoEstanteria[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getTiposDeEstanteria().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar cargar los tipos de estantería',
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
          title: 'Error al intentar cargar los tipos de estantería',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createTipoEstanteria() {
    this.router.navigate(['/gral/tipos-estanteria-data/null/M']);
  }

  editTipoEstanteria(tipoEstanteria: TipoEstanteria, modo: string) {
    console.log('edit');
    console.log(tipoEstanteria);
    this.router.navigate(['/gral/tipos-estanteria-data/', tipoEstanteria.id, modo]);
  }

  deleteTipoEstanteria(tcId: string) {
    // En un futuro puedo controlar que no tenga pedidos y si los tiene avisar (si voy a deshabilitar)
    Swal.fire({
      title: 'Seguro desea eliminar el tipo de estantería?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teElimino(tcId);
      } else {
        console.log('cancele');
      }
    });
  }

  teElimino(tcId: string) {
    this.matser.delTipoEstanteria(tcId).subscribe(
      resu => {
        console.log(resu)
        if (resu.error || resu.object == null) {
          Swal.fire({
            title: 'Error al intentar eliminar el tipo de estantería',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          if (resu.object) {
            Swal.fire({
              title: 'Tipo de estantería elinada con exito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.initData();
          } else {
            Swal.fire({
              title: 'Error al intentar eliminar el tipo de estantería',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      }, error => {
        Swal.fire({
          title: 'Error al intentar eliminar el tipo de estantería',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }


}
