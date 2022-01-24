import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dato } from '../../models/dato';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import pageSettings from '../../../../config/page-settings';
import {Location} from '@angular/common';




@Component({
  selector: 'app-datos-editar',
  templateUrl: './datos-editar.component.html',
  styleUrls: ['./datos-editar.component.css']
})
export class DatosEditarComponent implements OnInit, OnDestroy {

  pageSettings = pageSettings;
  objDato = new Dato();
  varsLan: string[] = ['en', 'sp', 'po'];
  elLan: string;
  foto: File = null;
  previewUrl: any = null;
  swaltit: string;
  swalmsg: string;
  constructor(private router: Router,
              private datosrv: DatosService,
              private _location: Location) {
              }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
              }


  ngOnInit() {
    this.datosrv.getDato('1').subscribe(
      resul => {
        if (resul != null) {
          this.objDato = resul;
          this.previewUrl = 'data:image/png;base64,' + this.objDato.logo;
        } else {
          this.objDato.nombre = 'S/D';
        }
      });
  }

  creoDato(f: NgForm) {
    const oki: boolean = this.controlo();
  }

  controlo(): boolean {
    if (this.objDato.nombre == null || this.objDato.nombre === '') {
      this.swaltit = 'Atención!';
      this.swalmsg = 'El nombre está vacío';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }

    if (this.foto != null) {
      let reader = new FileReader();
      let fileByteArray = [];
      reader.readAsArrayBuffer(this.foto);
      reader.onload = (evt) => {
        let arrayBuffer = <ArrayBuffer>reader.result;
        let array = new Uint8Array(arrayBuffer);
        for (var i = 0 ; i < array.length; i++) {
          fileByteArray.push(array[i]);
        }
        this.objDato.logo = [];
        this.objDato.logo = fileByteArray;
        this.objDato.id = 1;
        this.tecreo();
      } 
    } else {
      this.objDato.id = 1;
      this.tecreo();
    };
    
    return true;
  }

  tecreo() {
    

    this.datosrv.saveDato(this.objDato).subscribe(
      resul => {
        this.swaltit = '¡Exito!';
        this.swalmsg = 'Datos cargados correctamente';

        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });


        },
        error => {
          this.swaltit = '¡Error!';
          this.swalmsg = 'No se pudo modificar la base de datos';
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
