import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { MatricerosService } from '../../services/matriceros.service';
import { StorageCds } from '../../models/storage-cds';

@Component({
  selector: 'app-storage-data',
  templateUrl: './storage-data.component.html',
  styleUrls: ['./storage-data.component.scss']
})
export class StorageDataComponent implements OnInit {

  storageId: string | null = 'null';
  esAlta = false;
  storage = new StorageCds();
  titulo = '';
  mode: string | null = '';
  visor = false;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.storageId = params.get('id');
        this.mode = params.get('mode');
        if (this.storageId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de centro logístico';
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de centro logístico';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de centro logístico';
            this.visor = true;
          }
          if (this.storageId != null) {
            this.matser.getStorage(+this.storageId).subscribe(
              resu => {
                console.log(resu);
                this.storage = resu;
              }, error => {
                console.log('Por el error');
                console.log(error);
                Swal.fire({
                  title: 'Error al cargar el centro logístico',
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

  sendStorage(f: NgForm) {
    console.log('a grabar deposito');
    console.log(this.storage);
    if (f.valid) {
      if (this.esAlta) {
        this.storage.enabled = true;
      }
      this.matser.setStorage(this.storage).subscribe(
        resu => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Centro logístico creado con exito';
            this.storage = new StorageCds();
          } else {
            msg = 'Centro logístico modificado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Error al intentar crear el centro logístico';
          } else {
            msg = 'Error al intentar editar el centro logístico';
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
