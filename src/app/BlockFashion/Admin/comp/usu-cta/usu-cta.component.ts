import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../../Tools/serv/login.service';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usu-cta',
  templateUrl: './usu-cta.component.html',
  styleUrls: ['./usu-cta.component.css']
})
export class UsuCtaComponent implements OnInit, OnDestroy {

  pageSettings = pageSettings;
  objPerfil = new Usuario();
  foto: File = null;
  previewUrl: any = null;
  swaltit: string;
  swalmsg: string;

  constructor(private perfsrv: UsuarioService,
              private logsrv: LoginService,
              private _location: Location) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.objPerfil = this.logsrv.getUsuarioFromStorage();
    this.previewUrl = 'data:image/png;base64,' + this.objPerfil.foto;
  }

  seteoUsuario(f: NgForm) {
    
    if (this.foto != null) {
      let reader = new FileReader();
      let fileByteArray = [];
      reader.readAsArrayBuffer(this.foto);
      reader.onload = (evt) => {
        let arrayBuffer = <ArrayBuffer>reader.result;
        let array = new Uint8Array(arrayBuffer);
        for (var i=0 ; i < array.length; i++) {
          fileByteArray.push(array[i]);
         }
        this.objPerfil.foto = [];
        this.objPerfil.foto = fileByteArray;
        this.graboUsuario();
      }
    } else {
      this.graboUsuario();
    }
  }

  graboUsuario(){
    this.perfsrv.setUsuario(this.objPerfil).subscribe(
      resul => {
        this.logsrv.guardarUsuario(this.objPerfil.userName);
        this.swaltit = 'Exito!';
        this.swalmsg = 'Usuaria/o modificado correctamente';

        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this._location.back();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'No se pudo modificar el usuario/a';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  processFile(event: any) {
    this.foto = event.target.files[0];
    this.preview();
  }

  preview() {
    let reader = new FileReader();
    reader.readAsDataURL(this.foto);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }

  volver(){
    this._location.back();
  }

}
