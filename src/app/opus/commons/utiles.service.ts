import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Codiguera } from './codiguera';

@Injectable({
  providedIn: 'root'
})
export class UtilesService {

  constructor() { }

  alertWarning(mensaje: string) {
    Swal.fire({
      title: 'Atención!',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  }

  alertError(mensaje: string) {
    Swal.fire({
      title: 'Error!',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  alertOK(mensaje: string) {
    Swal.fire({
      title: 'OK!',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  getUnidadesPeso(): Codiguera[] {
    const lista: Codiguera[] = [];

    const l1 = new Codiguera();
    l1.clave = 'gramos';
    l1.descripcion = "Gramos"
    l1.entidad = 'Peso';
    lista.push(l1);

    const l2 = new Codiguera();
    l2.clave = 'kilos'; 
    l2.descripcion = "Kilogramos"
    l2.entidad = 'Peso';
    lista.push(l2);

    const l3 = new Codiguera();
    l3.clave = 'toneladas';
    l3.descripcion = "Toneladas"
    l3.entidad = 'Peso';
    lista.push(l3);
    
    return lista;
  }

  getUnidadesTiempo(): Codiguera[] {
    const lista: Codiguera[] = [];

    const l1 = new Codiguera();
    l1.clave = 'segundos';
    l1.descripcion = "Segundos"
    l1.entidad = 'Tiempo';
    lista.push(l1);

    const l2 = new Codiguera();
    l2.clave = 'minutos'; 
    l2.descripcion = "Minutos"
    l2.entidad = 'Tiempo';
    lista.push(l2);

    const l3 = new Codiguera();
    l3.clave = 'horas';
    l3.descripcion = "Horas"
    l3.entidad = 'Tiempo';
    lista.push(l3);

    const l4 = new Codiguera();
    l4.clave = 'dias';
    l4.descripcion = "Días"
    l4.entidad = 'Tiempo';
    lista.push(l4);
    
    return lista;
  }

  getUnidadesVolumen(): Codiguera[] {
    const lista: Codiguera[] = [];

    const l1 = new Codiguera();
    l1.clave = 'mililitros';
    l1.descripcion = "Mililitros"
    l1.entidad = 'Volumen';
    lista.push(l1);

    const l2 = new Codiguera();
    l2.clave = 'decilitros'; 
    l2.descripcion = "Decilitros"
    l2.entidad = 'Volumen';
    lista.push(l2);

    const l3 = new Codiguera();
    l3.clave = 'litros';
    l3.descripcion = "Litros"
    l3.entidad = 'Volumen';
    lista.push(l3);

    const l4 = new Codiguera();
    l4.clave = 'hectolitros';
    l4.descripcion = "Hectolitros"
    l4.entidad = 'Volumen';
    lista.push(l4);
    
    return lista;
  }

  getUnidadesTemp(): Codiguera[] {
    const lista: Codiguera[] = [];

    const l1 = new Codiguera();
    l1.clave = 'celcius';
    l1.descripcion = "°Celcius"
    l1.entidad = 'Temperatura';
    lista.push(l1);

    const l2 = new Codiguera();
    l2.clave = 'farenheit'; 
    l2.descripcion = "°Farenheit"
    l2.entidad = 'Temperatura';
    lista.push(l2);
    
    return lista;
  }
}
