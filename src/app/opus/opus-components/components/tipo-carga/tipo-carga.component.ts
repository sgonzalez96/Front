import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoCarga } from '../../models/tipo-carga';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-tipo-carga',
  templateUrl: './tipo-carga.component.html',
  styleUrls: ['./tipo-carga.component.scss']
})
export class TipoCargaComponent implements OnInit {

  list: TipoCarga[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getTiposDeCarga().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar cargar los tipos de carga',
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
          title: 'Error al intentar cargar los tipos de carga',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createTipoCarga() {
    this.router.navigate(['/gral/tipos-carga-data/null/M']);
  }

  editTipoCarga(tipoCarga: TipoCarga, modo: string) {
    console.log('edit');
    console.log(tipoCarga);
    this.router.navigate(['/gral/tipos-carga-data/', tipoCarga.id, modo]);
  }

  deleteTipoCarga(tcId: string) {
    // En un futuro puedo controlar que no tenga pedidos y si los tiene avisar (si voy a deshabilitar)
    Swal.fire({
      title: 'Seguro desea eliminar el tipo de carga?',
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
    this.matser.delTipoCarga(tcId).subscribe(
      resu => {
        console.log(resu)
        if (resu.error || resu.object == null) {
          Swal.fire({
            title: 'Error al intentar eliminar el tipo de carga',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          if (resu.object) {
            Swal.fire({
              title: 'Tipo de carga elinada con exito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.initData();
          } else {
            Swal.fire({
              title: 'Error al intentar eliminar el tipo de carga',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      }, error => {
        Swal.fire({
          title: 'Error al intentar eliminar el tipo de carga',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }


}
