import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Device } from '../../models/device';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-device-date',
  templateUrl: './device-date.component.html',
  styleUrls: ['./device-date.component.scss']
})
export class DeviceDateComponent implements OnInit {

  devId : string | null = 'null';
  esAlta = false;
  device = new Device();
  titulo = '';
  mode : string | null = '';
  visor = false;

  constructor(private activeRoute: ActivatedRoute, private matser: MatricerosService, private location: Location) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(
      params => {
        this.devId = params.get('id');
        this.mode = params.get('mode');
        if (this.devId == 'null') {
          this.esAlta = true;
          this.visor = false;
          this.titulo = 'Alta de dispositivo';
        } else {
          this.esAlta = false;
          if (this.mode == 'M') {
            this.titulo = 'Edición de dispositivo';
            this.visor = false;
          } else {
            this.titulo = 'Visualización de dispositivo';
            this.visor = true;
          }
          if (this.devId != null) {
            this.matser.getDevice(this.devId).subscribe(
            resu => {
              console.log(resu);
              this.device = resu;
            }, error => {
              console.log('Por el error');
              console.log(error);
              Swal.fire({
                title: 'Error al cargar el dispositivo',
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

  sendDevice(f: NgForm) {
    console.log('a grabar dispositivo');
    console.log(this.device);
    if (f.valid) {
      this.matser.setDevices(this.device).subscribe(
        resu => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Dispositivo creado con exito';
            this.device = new Device();
          } else {
            msg = 'Dispositivo modificado con exito';
          }
          Swal.fire({
            title: msg,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }, error => {
          let msg = '';
          if (this.esAlta) {
            msg = 'Error al intentar crear el dispositivo';
          } else {
            msg = 'Error al intentar editar el dispositivo';
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
