import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Rol } from '../../models/rol';
import { Usuario } from '../../models/usuario';
import { RolService } from '../../services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol-lista',
  templateUrl: './rol-lista.component.html',
  styleUrls: ['./rol-lista.component.css']
})
export class RolListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Rol[];
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  username = '';
  objUsu: Usuario;
  objRol: Rol;
  swalget = '';
  id_Rol = '';

  constructor(
    private rolsrv: RolService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.swalget = 'Cargando datos ... ';
    this.cargoRol();
  }

  cargoRol() {
    this.lista = [];
    Swal.fire({
      title: this.swalget
    });
    Swal.showLoading();

    this.rolsrv.getRoles().subscribe(
      resu => {
        this.lista = resu ;
        Swal.close();
      }, error => {
        Swal.close();
      });
  }

  exportExcel() {}

  baja_rol(idRol){
    this.swaltit = '¿Seguro de eliminar el rol de usuaria/o?';
    this.swalmsg = '';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idRol);
      }
    });

  }


  teborro(idRol) {
    this.id_Rol = idRol
    this.rolsrv.getRol(this.id_Rol).subscribe(
      resu => {
        this.objRol = resu;
        this.rolsrv.deleteRol(this.id_Rol).subscribe(
          resul => {
            this.swaltit = '¡Exito!';
            this.swalmsg = 'El rol ha sido eliminado correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.ngOnInit();
          },
            error => {
              this.swaltit = 'Error!';
              this.swalmsg = 'No se pudo completar la operación';
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
}
