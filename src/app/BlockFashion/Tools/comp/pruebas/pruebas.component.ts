import { Component, ViewChild, OnInit } from '@angular/core';  

@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.css'],
})
export class PruebasComponent implements OnInit {
  lista: eventoDTO[];

  ngOnInit(){
    this.lista = [];
    let eleven: eventoDTO = new eventoDTO();
    eleven.status = 'Inscripciones abiertas';
    eleven.titulo = 'Evento uno que evento';
    eleven.fecha = new Date();
    this.lista.push(eleven);

    eleven.status = 'Inscripciones abiertas';
    eleven.titulo = 'Evento uno que evento';
    eleven.fecha = new Date();
    this.lista.push(eleven);
    eleven.status = 'Inscripciones abiertas';
    eleven.titulo = 'Evento uno que evento';
    eleven.fecha = new Date();
    this.lista.push(eleven);
    eleven.status = 'Inscripciones abiertas';
    eleven.titulo = 'Evento uno que evento';
    eleven.fecha = new Date();
    this.lista.push(eleven);
    eleven.status = 'Inscripciones abiertas';
    eleven.titulo = 'Evento uno que evento';
    eleven.fecha = new Date();
    this.lista.push(eleven);
  }
}

export class eventoDTO {
  public logo: any[];
  public status: string;
  public titulo: string;
  public fecha: Date;
}
