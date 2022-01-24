import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatricerosService } from '../../services/matriceros.service';
import { Device } from '../../models/device';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  list: Device[] = [];

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.list = [];
    this.matser.getDevices().subscribe(
      resu => {
        console.log('El findall devuelve');
        console.log(resu);
        this.list = resu;
      }, error => {
        console.log('error en el findall');
        console.log(error);
        Swal.fire({
          title: 'Error al intentar cargar los dispositivos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.list = [];
      }
    );
  }

  createDevice() {
    this.router.navigate(['/gral/device-data/null/M']);
  }

  deviceData(device: Device, modo: string) {
    console.log('edit');
    console.log(device);
    this.router.navigate(['/gral/device-data/', device.deviceId, modo]);
  }

  deleteDevice(device: Device) {
    console.log('delete');
    console.log(device);
    Swal.fire({
      title: 'Seguro desea eliminar el dispositivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teDeleteo(device.deviceId);
      } else {
        console.log('cancele');
      }
    });
  }

  teDeleteo(devId: string) {
    this.matser.deleteDevice(devId).subscribe(
      resu => {
        if (resu) {
          Swal.fire({
            title: 'Dispositivo eliminado con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.initData();
        } else {
          Swal.fire({
            title: 'Error al intentar eliminar el dispositivo',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }, error => {
        console.log('Error al eliminar');
        console.log(error);
        Swal.fire({
          title: 'Error al intentar eliminar el dispositivo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

}
