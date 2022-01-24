import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../models/usuario';
import { Rol } from '../../models/rol';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

class rolSeleccionado {
  rol: Rol;
  selected: boolean;
}

@Component({
  selector: 'app-usu-crear',
  templateUrl: './usu-crear.component.html',
  styleUrls: ['./usu-crear.component.css']
})
export class UsuCrearComponent implements OnInit, OnDestroy {


  pageSettings = pageSettings;
  objPerfil = new Usuario();
  roles: Rol[];
  rolesMarcados: rolSeleccionado[] = [];
  swaltit: string;
  swalmsg: string;

  constructor(private perfsrv: UsuarioService,
              private rolsrv: RolService,
              private _location: Location) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {

    this.rolsrv.getRoles().subscribe(
      resu => {
        this.roles = resu;
        for (let i = 0; i < this.roles.length; i++) {
          let elr = new rolSeleccionado();
          elr.rol = this.roles[i];
          elr.selected = false;
          this.rolesMarcados.push(elr);
        }
      }
    );
  }

  crearUsuario(f: NgForm) {
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
        this.objPerfil.password = this.objPerfil.userName;
        this.tecreo();
      }
    } else {
      this.swaltit = 'Atención!';
      this.swalmsg = 'No selecciono ningun rol';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }

  controlo(): boolean {
    if (this.objPerfil.userName == null || this.objPerfil.userName === '') {
      this.swaltit = 'Atención!';
      this.swalmsg = 'El id del usuario/a esta vacío';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    if (this.objPerfil.fullname == null || this.objPerfil.fullname === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'El nombre del usuaria/o esta vacío';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }
    this.perfsrv.getUsuario(this.objPerfil.userName).subscribe(
      yasta => {
        if (yasta != null ) {
          this.swaltit = 'Atención';
          this.swalmsg = 'Ya existe ese id de usuario ';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
          return false;
        } else {
          return true;
        }
      }
    );



  }

  tecreo() {
    this.perfsrv.creoUsuario(this.objPerfil).subscribe(
      resul => {
        this.swaltit = '¡Exito!';
        this.swalmsg = 'Usuaria/o fue creado correctamente';
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
          this.swaltit = 'Error';
          this.swalmsg = 'No se pudo crear usuario/a';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK'
          });
        }
    );
  }

volver(){
  this._location.back();
}
}
