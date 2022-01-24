import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import pageSettings from '../../../../config/page-settings';
import { Abogado } from '../../models/abogado';
import { AbogadosService } from '../../serv/abogados.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-abogados',
  templateUrl: './abogados.component.html',
  styleUrls: ['./abogados.component.css']
})
export class AbogadosComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Abogado[];
  objObj: Abogado;
  elObj: Abogado;
  tit = 'Lista de Abogados';
  abierto = false;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';


  constructor(
    private abosrv: AbogadosService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.cargoObj();
  }

  cargoObj() {
    this.lista = [];
    this.abosrv.getAbogados().subscribe(
      res => {
        this.lista = res;
        this.objObj = new Abogado();
        this.elObj = this.lista[0];
      }
    );
  }


  baja_obj(idObj) {
    this.swaltit = '¿Desea cambiar el estado del abogado?';
    this.swalmsg = 'El estado del abogado será modificado en la base de datos';
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
    this.abosrv.getAbogado(idObj).subscribe(
      resabo => {
        this.objObj = resabo;
        if (this.objObj.activo) {
          this.objObj.activo = false;
        } else {
          this.objObj.activo = true;
        }
        this.abosrv.saveAbogado(this.objObj).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Item modificado correctamente';
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
              this.swalmsg = 'No se pudo modificar el registro';
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


  selObj(obj) {
    this.elObj = obj;
  }

  altaObj() {
    this.abierto = true;
    this.objObj = new Abogado();
  }

  creoObj(f: NgForm) {
    if (this.objObj.nombre == null || this.objObj.nombre === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar un nombre';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.objObj.activo = true;
    this.abosrv.saveAbogado(this.objObj).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El ítem fue creado correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objObj = new Abogado();
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
