import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';

@Component({
  selector: 'app-usu-pass',
  templateUrl: './usu-pass.component.html',
  styleUrls: ['./usu-pass.component.css']
})
export class UsuPassComponent implements  OnInit, OnDestroy {

  pageSettings = pageSettings;
  objPerfil = new Usuario();
  passnew = '';
  passconf = '';
  swaltit: string;
  swalmsg: string;
  swaldos: string;

  constructor(private perfsrv: UsuarioService,
              private logsrv: LoginService,
              private router: Router,
              private _location: Location) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.objPerfil = this.logsrv.getUsuarioFromStorage();
  }

  changePass(f: NgForm) {
    this.camposIngresados();
  }

  camposIngresados(): boolean {
    if (this.passnew == null || this.passnew === '' || this.passconf == null || this.passconf == '') {
      this.swaltit = '¡Atención!';
      this.swalmsg = 'Algunas de las contraseñas no ha sido ingresada';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK'
        });
        return;
    }
    if (this.passnew != this.passconf) {
      this.swaltit = '¡Atención!';
      this.swalmsg = 'Las contraseñas no coinciden';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        confirmButtonText: 'OK',
      });
      return;
    }
    this.cambioPass();
  }

  cambioPass() {
    this.objPerfil.password = this.passnew;
    this.perfsrv.cambioPass(this.objPerfil).subscribe(
      resul => {
        this.logsrv.guardarUsuario(this.objPerfil.userName);
        this.swaltit = '¡Exito!';
        this.swalmsg = 'Contraseña modificada correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
         this._location.back();
        },
        error => {
          this.swaltit = '¡Error!';
          this.swalmsg = 'No se pudo modificar la información!';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );

  }

  volver(){
    this._location.back();
  }
}
