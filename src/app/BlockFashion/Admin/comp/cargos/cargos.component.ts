import { Component, OnInit } from '@angular/core';
import { Cargo } from '../../models/cargo';
import { CargoService } from '../../services/cargo.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import pageSettings from '../../../../config/page-settings';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Cargo[];
  objObj: Cargo;
  elObj: Cargo;
  tit = 'Cargos Profesionales';
  abierto = false;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  subgrupo = 0;
  varsGrupo = [
    "1 - Jardines de infantes y guarderías",
    "2 - Enseñanza preescolar, escolar, secundaria",
    "3 - Técnica, comercial, academias de choferes",
    "4 - Especial para personas con capacidades diferentes",
    "5 - Enseñanza de idiomas",
    "6 - Profesores particulares y otros tipos de ensñanza",
    "7 - Educación no formal"]


  constructor(
    private cargosrv: CargoService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {

    this.cargoObj();
  }

  cargoObj() {
    this.lista = [];
    console.log("vamos " , this.varsGrupo[this.subgrupo].substr(0,1) );
    this.cargosrv.getCcargos(this.varsGrupo[this.subgrupo].substr(0,1)).subscribe(
      res => {
        this.lista = res;
        this.objObj = new Cargo();
        this.elObj = this.lista[0];
      }
    );
  }

  onChangeSub(lafoca) {
    if (lafoca == null) {
      this.subgrupo = 0;
    } else {
      for (let i = 0 ; i < this.varsGrupo.length; i++){
        if (lafoca.trim() === this.varsGrupo[i].trim()) {
          this.subgrupo = i;
          this.cargoObj();
          break;
        }
      }
    }
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
    this.cargosrv.deleteCargo(idObj).subscribe(
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
    this.objObj = new Cargo();
  }

  creoObj(f: NgForm) {
    if (this.objObj.nombre == null || this.objObj.nombre === '') {
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
    this.objObj.subgrupo = parseInt(this.varsGrupo[this.subgrupo].substr(0, 1), 10);
    this.cargosrv.saveCargo(this.objObj).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El ítem fue creado correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objObj = new Cargo();
          this.cargoObj();
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
