import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { TipoAct } from '../../models/tipoact';
import { TipoactService } from '../../serv/tipoact.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tipoact',
  templateUrl: './tipoact.component.html',
  styleUrls: ['./tipoact.component.css']
})
export class TipoactComponent implements OnInit {

  pageSettings = pageSettings;
  lista: TipoAct[];
  objObj: TipoAct;
  elObj: TipoAct;
  tit = 'Tipos de actividades';
  abierto = false;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';


  constructor(
    private tiposrv: TipoactService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.cargoObj();
  }

  cargoObj() {
    this.lista = [];
    this.tiposrv.getTipoActividades().subscribe(
      res => {
        this.lista = res;
        this.objObj = new TipoAct();
        this.elObj = this.lista[0];
      }
    );
  }

  
  baja_obj(idObj) {

    this.swaltit = '¿Desea eliminar el item?';
    this.swalmsg = 'El item será eliminado de la base de datos';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idObj);
      }
    });

  }

  teborro(idObj) {
    this.tiposrv.deleteTipoAct(idObj).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Item eliminado correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.cargoObj();
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

  
  selObj(obj) {
    this.elObj = obj;
  }

  altaObj() {
    this.abierto = true;
    this.objObj = new TipoAct();
  }

  creoObj(f: NgForm) {
    if (this.objObj.descripcion == null || this.objObj.descripcion === '') {
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

    this.tiposrv.saveTipoAct(this.objObj).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El ítem fue creado correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objObj = new TipoAct();
          this.cargoObj();
          this.abierto = false;
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear el item';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }


  cerrarAltaObj() {
    this.abierto = false;
  }

  modifObj(obj) {
    this.abierto = true;
    this.objObj = obj;
  }

  
}
