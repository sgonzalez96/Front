import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotiService {

  constructor() { }

  notiError(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  notiOK(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  notiWarning(mensaje: string) {
    Swal.fire({
      title: mensaje,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }
}
