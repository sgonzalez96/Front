import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Evento } from '../../models/evento';
import { Location } from '@angular/common';
import { EventosService } from '../../serv/eventos.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { TipoAct } from '../../models/tipoact';
import { TipoactService } from '../../serv/tipoact.service';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { Ciudad } from '../../../Admin/models/ciudad';
import { CiudadService } from '../../../Admin/services/ciudad.service';

@Component({
  selector: 'app-eve-crear',
  templateUrl: './eve-crear.component.html',
  styleUrls: ['./eve-crear.component.css']
})
export class EveCrearComponent implements OnInit, OnDestroy {

  pageSettings = pageSettings;
  objEve = new Evento();
  swaltit: string;
  swalmsg: string;
  varsTipo: TipoAct[];
  elTipo: TipoAct;
  elusu: Usuario;
  varsCiud: Ciudad[];
  laCiud: Ciudad = new Ciudad();

  constructor(private evesrv: EventosService,
              private tipsrv: TipoactService ,
              private ciusrv: CiudadService,
              private logsrv: LoginService,
              private _location: Location) {

   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.varsTipo = [];
    this.tipsrv.getTipoActividades().subscribe(
      restip => {
        this.varsTipo = restip;
        this.onChangeTipo(this.varsTipo[0].descripcion)
      }
    );
    this.objEve.lugar = 'SINTEP';
    this.varsCiud = [];
    this.ciusrv.getCiudades().subscribe(
      resci => {
        this.varsCiud = resci;
        for (const unaci of resci) {
          if (unaci.nombre.trim().toLowerCase() === 'montevideo') {
            this.laCiud = unaci;
            break;
          }
        }
        if (this.laCiud === null) {
          this.laCiud = this.varsCiud[0];
        }
      }
    );


  }

  onChangeCiud(city) {
    for (const ciud of this.varsCiud){
      if (city.trim() === ciud.nombre.trim()) {
        this.laCiud = ciud;
        break;
      }
    }
  }


  onChangeTipo(tipo) {
    for (const mitipo of this.varsTipo){
      if (tipo.trim() === mitipo.descripcion.trim()) {
        this.elTipo = mitipo;
        this.objEve.inscripcion = mitipo.inscribe;
        this.objEve.asistencia  = mitipo.asistencia;
        this.objEve.evaluacion  = mitipo.evalua;
        break;
      }
    }
  }
  creoEve(f: NgForm) {
    if (this.objEve.nombre == null || this.objEve.nombre === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar una descripción';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.objEve.tipoact = this.elTipo;
    this.objEve.usuario = this.elusu;
    this.objEve.status = 'Creado';
    this.objEve.ciudad = this.laCiud;
    this.evesrv.saveEvento(this.objEve).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El evento fue creado correctamente'
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear el evento';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  volver() {
    this._location.back();
  }
}
