import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Via } from '../../models/via';
import { ViapagoService } from '../../services/viapago.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-viapago',
  templateUrl: './viapago.component.html',
  styleUrls: ['./viapago.component.css']
})
export class ViapagoComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Via[];
  objObj: Via;
  elObj: Via;
  tit = 'Vías de pago';
  abierto = false;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';


  constructor(
    private cargosrv: ViapagoService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.cargoObj();
  }

  cargoObj() {
    this.lista = [];
    this.cargosrv.getVias().subscribe(
      res => {
        this.lista = res;
        this.objObj = new Via();
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
    this.cargosrv.deleteVia(idObj).subscribe(
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
    this.objObj = new Via();
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

    this.cargosrv.saveVia(this.objObj).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El ítem fue creado correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objObj = new Via();
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
