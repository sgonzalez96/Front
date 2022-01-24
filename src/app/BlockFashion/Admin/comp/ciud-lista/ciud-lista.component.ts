import { Component, OnInit } from '@angular/core';
import { Ciudad } from '../../models/ciudad';
import { Deptos } from '../../models/depto';
import pageSettings from '../../../../config/page-settings';
import Swal from 'sweetalert2';
import { CiudadService } from '../../services/ciudad.service';
import { NgForm } from '@angular/forms';
import { Localidad } from '../../models/localidad';

@Component({
  selector: 'app-ciud-lista',
  templateUrl: './ciud-lista.component.html',
  styleUrls: ['./ciud-lista.component.css']
})
export class CiudListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Ciudad[];
  objCiud: Ciudad;
  varsDep: Deptos[];
  elDep: Deptos;
  abierto = false;
  laCiudad: Ciudad;

  lista2: Localidad[];
  objLoc: Localidad;
  laLocalidad: Localidad;
  loc_abierto = false;

  
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';


  constructor(
    private ciudsrv: CiudadService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.varsDep = [];
    console.log("arranca");
    this.ciudsrv.getDeptos().subscribe(
      resdep => {
        console.log("los deptos ");
        console.log(resdep);
        this.varsDep = resdep;
        this.elDep = this.varsDep[0];
        console.log("el borrado");
        this.cargoCiudad();
      }
    );
  }

  cargoCiudad() {
    this.lista = [];
    this.ciudsrv.getCiuDep(this.elDep.id.toString()).subscribe(
      resciu => {
        if (resciu != undefined && resciu != null){
          this.lista = resciu;
          this.laCiudad = this.lista[0];
          this.objCiud = new Ciudad();
          this.objCiud.dep = this.elDep;
          this.cargoLocalidad();
        }
      }
    );
  }

  
  baja_ciud(idCiud) {

    this.swaltit = '¿Desea eliminar la ciudad?';
    this.swalmsg = 'La ciudad será borrada de la faz de la tierra';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idCiud);
      }
    });

  }

  teborro(idCiud) {
    this.ciudsrv.getCiudad(idCiud).subscribe(
      resu => {
        this.objCiud = resu;
        this.ciudsrv.deleteCiudad(idCiud).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Ciudad eliminada correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.ngOnInit();
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
    );
  }

  onChange(elDep) {
    for (const dep of this.varsDep){
      if (elDep.trim() == dep.nombre.trim()) {
        this.elDep = dep;
        this.cargoCiudad();
        break;
      }
    }
  }

  selCiudad(lacity) {
    this.laCiudad = lacity;
    this.cargoLocalidad();
  }

  altaCiud() {
    this.abierto = true;
    this.objCiud = new Ciudad();
    this.objCiud.dep = this.elDep;

  }

  creoCiudad(f: NgForm) {
    if (this.objCiud.nombre == null || this.objCiud.nombre === '') {
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

    this.ciudsrv.saveCiudad(this.objCiud).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'La ciudad fue creada correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objCiud = new Ciudad();
          this.objCiud.dep = this.elDep;
          this.cargoCiudad();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear la ciudad';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }


  cerrarAltaCiudad() {
    this.abierto = false;
  }

  modifCiud(lacity) {
    this.abierto = true;
    this.objCiud = lacity;
  }

  //------------------- DE LOCALIDADES --------------------------------------------------------------
  cargoLocalidad() {
    this.lista2 = [];
    this.ciudsrv.getLocCiud(this.laCiudad.id.toString()).subscribe(
      resloc => {
        this.lista2 = resloc;
        this.laLocalidad = this.lista2[0];
        this.objLoc = new Localidad();
        this.objLoc.ciud = this.laCiudad;
      }
    );
  }

  
  baja_loc(idLoc) {

    this.swaltit = '¿Desea eliminar este pueblucho?';
    this.swalmsg = 'La localidad será eliminada de la base de datos';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborroloca(idLoc);
      }
    });

  }

  teborroloca(idLoc) {
    this.ciudsrv.getLocalidad(idLoc).subscribe(
      resu => {
        this.objLoc = resu;
        this.ciudsrv.deleteLocalidad(idLoc).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Localidad eliminada correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.ngOnInit();
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
    );
  }


  selLoc(laloca) {
    this.laLocalidad = laloca;
  }

  altaLoc() {
    this.loc_abierto = true;
    this.objLoc = new Localidad();
    this.objLoc.ciud = this.laCiudad;

  }

  creoLoc(f: NgForm) {
    if (this.objLoc.nombre == null || this.objLoc.nombre === '') {
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

    this.ciudsrv.saveLocalidad(this.objLoc).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'La ciudad fue creada correctamente';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.objLoc = new Localidad();
          this.objLoc.ciud = this.laCiudad;
          this.cargoLocalidad();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear la localidad';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }


  cerrarAltaLoc() {
    this.loc_abierto = false;
  }

  modifLoc(lacity) {
    this.abierto = true;
    this.objCiud = lacity;
  }
}
