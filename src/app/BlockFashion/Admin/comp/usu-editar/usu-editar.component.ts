import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';
import { Rol } from '../../models/rol';
import { RolService } from '../../services/rol.service';
import { ActivatedRoute } from '@angular/router';
import { Log } from '../../models/log';

class rolSeleccionado {
  rol: Rol;
  selected: boolean;
}

@Component({
  selector: 'app-usu-editar',
  templateUrl: './usu-editar.component.html',
  styleUrls: ['./usu-editar.component.css']
})
export class UsuEditarComponent implements OnInit, OnDestroy {

  pageSettings = pageSettings;
  roles: Rol[];
  rolesMarcados: rolSeleccionado[] = [];
  objPerfil = new Usuario();
  foto: File = null;
  previewUrl: any = null;
  swaltit: string;
  swalmsg: string;
  swaldos: string;
  veolog = false;
  listalog: Log[] ;

  constructor(private perfsrv: UsuarioService,
              private rolsrv: RolService,
              private logsrv: LoginService,
              private _location: Location,
              private actRout: ActivatedRoute) {
    this.pageSettings.pageWithFooter = true;

  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.listalog = [];
    this.objPerfil = this.logsrv.getUsuarioFromStorage();
    
    this.traigoUsuario();
  }

  traigoUsuario() {
    this.actRout.paramMap.subscribe(
      params => {
        let nomusu = params.get('name');
        this.logsrv.getUsuback(nomusu).subscribe(
          resu => {
            this.objPerfil = resu;
            if (this.objPerfil.foto != null){
              this.previewUrl = 'data:image/png;base64,' + this.objPerfil.foto;
            }
            this.triagoRoles();
            this.perfsrv.getLogs('U', this.objPerfil.idUser.toString()).subscribe(
              reslog => {
                this.listalog = reslog;
              }
            );
          }
        );
      }
    );
  }

  triagoRoles() {
    this.rolsrv.getRoles().subscribe(
      resu => {
        this.roles = resu;
        for (let i = 0; i < this.roles.length; i++) {
          let elr = new rolSeleccionado();
          elr.rol = this.roles[i];
          elr.selected = false;

          for (let j = 0; j < this.objPerfil.roles.length; j++) {
            if(this.objPerfil.roles[j].idRol === this.roles[i].idRol) {
              elr.selected = true;
            }
          }

          this.rolesMarcados.push(elr);
        }
      }
    );
  }

  modificarUsuario(f: NgForm) {
    let listaroles: Rol[] = [];
    for (let i = 0; i < this.rolesMarcados.length; i++) {
      if (this.rolesMarcados[i].selected) {
        let rolasign = new Rol();
        rolasign.idRol = this.rolesMarcados[i].rol.idRol;
        rolasign.nombre = this.rolesMarcados[i].rol.nombre;
        rolasign.nivel = this.rolesMarcados[i].rol.nivel;
        listaroles.push(rolasign);
      }
    }

    if (listaroles.length > 0) {
      let oki: boolean = this.controlo();
      if (oki) {
        this.objPerfil.roles = listaroles;
        this.temodifico();
      }
    } else {
      this.swaltit = 'Atención!';
      this.swalmsg = 'No tiene asignado ningún rol';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }

  controlo(): boolean {
    if (this.objPerfil.userName == null || this.objPerfil.userName == '') {
      this.swaltit = 'Atneción!';
      this.swalmsg = 'Identificación del usuario/a en blanco';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    if (this.objPerfil.fullname === null || this.objPerfil.fullname === '') {
      this.swaltit = 'Atención!'
      this.swalmsg = 'Nombre de usuaria/o en blanco';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    return true;
  }

  temodifico() {
    this.perfsrv.setUsuario(this.objPerfil).subscribe(
      resul => {
        this.swaltit = 'Exito!';
        this.swalmsg = 'Usuario/a modificado correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
        //this.router.navigate(['/usuarios']);

        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'El usuaria/o no pudo ser modificado';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  reseteoPass() {
    this.swaltit = 'Desea resetear la contraseña ?';
    this.swalmsg = 'Quedara asignada al nro de afiliado ' + this.objPerfil.afinro;
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.tereseteo();
      }
    });
  }

  tereseteo() {
    this.objPerfil.password = this.objPerfil.afinro.toString().trim();
    this.perfsrv.cambioPass(this.objPerfil).subscribe(
      resul => {
        this.swaltit = 'Exito!';
        this.swalmsg = 'Usuaria/o fuemodificado correctamente';
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
          this.swalmsg = 'No se pudo modificar usuario/a';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  veoLog() {
    this.veolog = true;
  }

  ocultoLog() {
    this.veolog = false;
  }

  volver(){
    this._location.back();
  }

}
