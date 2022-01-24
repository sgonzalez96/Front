import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Rol } from '../../models/rol';
import { RolService } from '../../services/rol.service';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-crear',
  templateUrl: './rol-crear.component.html',
  styleUrls: ['./rol-crear.component.css']
})
export class RolCrearComponent implements OnInit, OnDestroy {


  pageSettings = pageSettings;
  objRol = new Rol();
  swaltit: string;
  swalmsg: string;
  elnivel: string;
  varsLevel: string[] = ['0  - Afiliado/a', '10 - Delegada/o', '40 - Asistente Legal', '45 - Secretariado', '50 - Organizacion', '90 - Super-usuaria/o' ] ;


  constructor(private rolsrv: RolService,
              private _location: Location) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.elnivel = this.varsLevel[0];
  }


  creoRol(f: NgForm) {
    if (this.objRol.nombre  == null || this.objRol.nombre === '') {
      this.swaltit = '¡Atención!';
      this.swalmsg = 'Nombre de rol vacío';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.objRol.nivel = parseInt(this.elnivel.substr(0, 2), 10);

    this.rolsrv.saveRol(this.objRol).subscribe(
      resul => {
        this.swaltit = '¡Exito!';
        this.swalmsg = 'Los datos fueron almacenados correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
        },
        error => {
          this.swaltit = '¡Error!';
          this.swalmsg = 'No se pudo modificar la base de datos';
          Swal.fire({
            title: this.swaltit,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  onChange(elLvl) {
    this.elnivel = elLvl.trim();
  }

  volver() {
    this._location.back();
  }
}

export class Level {
  dsc: string;
  lvl: number;
}
