import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StorageCds } from '../../models/storage-cds';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent implements OnInit {

  list: StorageCds[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getStorages().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        this.list = resu;
      }, error => {
        console.log('error en el findall');
        console.log(error);
        Swal.fire({
          title: 'Error al intentar cargar los centros logísticos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createStorage() {
    this.router.navigate(['/gral/storage-data/null/M']);
  }

  storageData(storage: StorageCds, modo: string) {
    console.log('edit');
    console.log(storage);
    this.router.navigate(['/gral/storage-data/', storage.storageId, modo]);
  }

  cambioEstado(habilito: boolean, stId: number) {
    // En un futuro puedo controlar que no tenga pedidos y si los tiene avisar (si voy a deshabilitar)
    if (!habilito) {
      Swal.fire({
        title: 'Seguro desea inhabilitar el centro logístico?',
        text: 'puede tener separaciones en curso apuntando al centro logístico!!!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log(result)
        if (result.value) {
          this.teCambioEstado(habilito, stId);
        } else {
          console.log('cancele');
        }
      });
    } else {
      Swal.fire({
        title: 'Seguro desea habilitar el centro logístico?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        console.log(result)
        if (result.value) {
          this.teCambioEstado(habilito, stId);
        } else {
          console.log('cancele');
        }
      });
    }
  }

  teCambioEstado(habilito: boolean, stId: number) {
    this.matser.changeStorageState(stId, habilito).subscribe(
      resu => {
        console.log(resu);
        if (resu) {
          let msg = '';
          if (habilito) {
            msg = 'Centro logístico habilitado con exito';
          } else {
            msg = 'Centro logístico deshabilitado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.initData();
        } else {
          Swal.fire({
            title: 'Error al intentar deshabilitar el centro logístico',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar deshabilitar el centro logístico',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
