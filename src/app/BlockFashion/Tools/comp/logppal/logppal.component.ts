import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../serv/login.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';

@Component({
  selector: 'app-logppal',
  templateUrl: './logppal.component.html',
  styleUrls: ['./logppal.component.css']
})
export class LogppalComponent implements OnInit, OnDestroy {
  bg;
  bgList;
  app;
  pageSettings = pageSettings;

  usuario = '';
  password = '';
  elusu: Usuario;
  objDato = new Dato();
  swaltit: string;
  swalmsg: string;

  constructor(
      private loginsrv: LoginService,
      private router: Router,
      private datsrv: DatosService) {
    this.pageSettings.pageEmpty = true;
  }

  ngOnDestroy() {
    this.pageSettings.pageEmpty = false;
  }

  ngOnInit() {
    sessionStorage.clear();
    

    // 11 x 17

    this.bg = './assets/img/login-bg/login-bg-17.jpg';
    this.bgList = [
      { 'bg': './assets/img/login-bg/login-bg-17.jpg', active: true },
      { 'bg': './assets/img/login-bg/login-bg-16.jpg' },
      { 'bg': './assets/img/login-bg/login-bg-15.jpg' },
      { 'bg': './assets/img/login-bg/login-bg-14.jpg' },
      { 'bg': './assets/img/login-bg/login-bg-13.jpg' },
      { 'bg': './assets/img/login-bg/login-bg-12.jpg' }
    ];
  }

  changeBg(list) {
    this.bg = list.bg;
    list.active = true;

    for (let bList of this.bgList) {
			if (bList != list) {
				bList.active = false;
			}
		}
  }

  formSubmit(f: NgForm) {
    this.loginsrv.checkeoAcceso(this.usuario , this.password).subscribe(
      res => {
        this.loginsrv.setRefreshToken(res.refresh_token);
        this.loginsrv.setToken(res.access_token);
        this.loginsrv.guardarUsuario(this.usuario);
        
        this.datsrv.getDato('1').subscribe(
          resul => {
            if (resul != null) {
              this.objDato = resul;
            }
          });

        this.loginsrv.getUsuback(this.usuario).subscribe(
          resp => {
            this.elusu = resp;
            if (this.elusu.enable === true) {
              this.router.navigate(['/mainpage']);
              //this.router.navigate(['/dashboard/general']);
            } else {
              Swal.fire({
                title: 'Error!',
                text: 'Usuario/a existe pero no esta activo',
                type: 'error',
                confirmButtonText: 'OK',
              });
            }
          });
      },
      error => {
        this.checkAfil();
        // Swal.fire({
        //   title: 'Error!',
        //   text: 'Usuaria/o, contraseña o estado de usuario/a incorrecto [' + 
        //   error.error.error_description + ']',
        //   type: 'error',
        //   confirmButtonText: 'OK',
        // });
      }
    );
  }

  //check if exist afil or not 
  checkAfil(){
    Swal.fire({
      titleText:"Usuario no encontrado",
      text:"Desea registrarse?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(res=>{
      if (res.value) {
        Swal.fire({
          titleText: "Ya estas afiliad@ a SINTEP ?",
          showCancelButton: true,
          showCloseButton: true,
          cancelButtonText: "NO",
          confirmButtonText:"SI",
        }).then(res=>{
          if (res.value) {
            this.router.navigate(['/solicitud/'+"1"]);
          }else {
            let result: string = res.dismiss.toString();
            if(result == 'cancel' ){
              this.router.navigate(['/solicitud/'+"0"]);
            }else if (result == 'close') {
              this.router.navigate(['/']);
            }
          }
        })
      }else{
        this.router.navigate(['/']);
      }
    })
  }

}
