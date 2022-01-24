import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../serv/eventos.service';
import { TipoactService } from '../../serv/tipoact.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { Usuario } from '../../../Admin/models/usuario';
import { TipoAct } from '../../models/tipoact';
import { Evento } from '../../models/evento';
import pageSettings from '../../../../config/page-settings';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Ciudad } from '../../../Admin/models/ciudad';
import { CiudadService } from '../../../Admin/services/ciudad.service';

@Component({
  selector: 'app-eve-editar',
  templateUrl: './eve-editar.component.html',
  styleUrls: ['./eve-editar.component.css']
})
export class EveEditarComponent implements OnInit, OnDestroy {

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
              private actRout: ActivatedRoute,
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
      }
    );
    this.actRout.paramMap.subscribe(
      params => {
        let idEve = params.get('id');
        this.evesrv.getEvento(idEve).subscribe(
          resu => {
            this.objEve = resu;
            this.onChangeTipo(this.objEve.tipoact.descripcion);
            this.laCiud = this.objEve.ciudad;
            this.varsCiud = [];
            this.ciusrv.getCiudades().subscribe(
              resci => {
                this.varsCiud = resci;
                if (this.laCiud == null) {
                  for (const unaci of resci) {
                    if (unaci.nombre.trim().toLowerCase() === 'montevideo') {
                      this.laCiud = unaci;
                      break;
                    }
                  }
                }
              }
            );

          }
        );
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
    this.objEve.ciudad = this.laCiud;
    this.evesrv.saveEvento(this.objEve).subscribe(
      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El evento fue modificado correctamente'
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
