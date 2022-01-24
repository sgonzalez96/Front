import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Evento } from '../../models/evento';
import { EventosService } from '../../serv/eventos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { TipoAct } from '../../models/tipoact';
import { TipoactService } from '../../serv/tipoact.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Evento[];
  objEve: Evento;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  varsOpcion: TipoAct[];
  eltipo: TipoAct;


  constructor(
    private evesrv: EventosService,
    private tipsrv: TipoactService,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.fecfin = this.fecini;

    const mitipo: TipoAct = new TipoAct();
    mitipo.descripcion = 'Todos los eventos';
    mitipo.id = 0;
    this.varsOpcion = [];
    this.varsOpcion.push(mitipo);
    this.eltipo = this.varsOpcion[0];
    if (sessionStorage.getItem('evelista_tipo') != null &&
        sessionStorage.getItem('evelista_tipo') !== undefined) {
        this.fecini = sessionStorage.getItem('evelista_feci');
        this.fecfin = sessionStorage.getItem('evelista_fecf');
    }
    this.tipsrv.getTipoActividades().subscribe(
      restip => {
        for (const otipo of restip) {
          this.varsOpcion.push(otipo);
          if (sessionStorage.getItem('evelista_tipo') != null &&
              sessionStorage.getItem('evelista_tipo') !== undefined) {
                if (sessionStorage.getItem('evelista_tipo') === otipo.id.toString()) {
                  this.eltipo = otipo;
                }
          }
        }
        this.cargo();
      }
    );


  }

  cargo() {
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    sessionStorage.setItem('evelista_feci', this.fecini);
    sessionStorage.setItem('evelista_fecf', this.fecfin);
    sessionStorage.setItem('evelista_tipo', this.eltipo.id.toString());
    this.evesrv.getEventosFecTipo(this.fecini, this.fecfin, this.eltipo.id.toString()).subscribe(
      resmon => {
        this.lista = resmon;
        Swal.close();
      }
    );
  }

  onChangeTipo(uno) {
    for (const pipi of this.varsOpcion) {
      if (uno.trim() === pipi.descripcion.trim()) {
        this.eltipo = pipi;
        break;
      }
    }
    console.log(this.eltipo);
  }

  exportExcel() {}

  baja_eve(idMon) {

    this.swaltit = '¿Desea eliminar el evento?';
    this.swalmsg = 'El evento será eliminado de la base de datos';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idMon);
      }
    });

  }


  teborro(idMon) {
    this.evesrv.getEvento(idMon).subscribe(
      resu => {
        this.objEve = resu;
        this.evesrv.deleteEvento(idMon).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Evento eliminado correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.ngOnInit();
          },
            error => {
              this.swaltit = 'Error';
              this.swalmsg = 'No se pudo eliminar el registro';
              Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'error',
                confirmButtonText: 'OK',
              });
          }
        );
      }
    );
  }
}
