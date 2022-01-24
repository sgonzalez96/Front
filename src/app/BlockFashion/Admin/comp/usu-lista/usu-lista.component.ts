import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../../Tools/serv/login.service';
import { DatosService } from '../../services/datos.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../models/dato';

@Component({
  selector: 'app-usu-lista',
  templateUrl: './usu-lista.component.html',
  styleUrls: ['./usu-lista.component.css']
})
export class UsuListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Usuario[];
  filtro: boolean;
  objDato: Dato;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  username = '';
  objUsu: Usuario;
  swalget = '';

  constructor(
    private datsrv: DatosService,
    private excsrv: ExceljsService,
    private ususrv: UsuarioService,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
    }

  ngOnInit() {
    this.filtro = true;
    this.swalget = 'Obteniendo datos ... ';

    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
        this.cargoUsu();
      }

    );
  }

  cargoUsu() {
    this.lista = [];
    Swal.fire({
      title: this.swalget
    });
    Swal.showLoading();

    this.ususrv.getUsuarios(this.filtro).subscribe(
      resu => {
        this.lista = resu ;

        Swal.close();
      }, error => {
        Swal.close();
      });
  }
  onChangeChk(elchk) {
    this.cargoUsu();
  }

  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {
      lisXls.push([
        this.lista[i].userName ,
        this.lista[i].fullname ,
        this.lista[i].email ,
        this.lista[i].enable ,
      ]);
    }

    const pHeader = ["id","Nombre","eMail","Activo"];
    const pCol = [20, 40,40,10];
    const pTit = 'Listado de Usuari@s';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }


  rehabilitar(usuname) {
    this.swaltit = 'Desea rehabilitar usuaria/o? ';
    this.swalmsg = 'El usuario/a será reingresado';
    this.swaldos = 'Cancelar';

    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.tecambio(usuname);
      }
    });
  }

  inhabilitar(usuname) {
    this.swaltit = 'Desea inhabilitar al usuaria/o';
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
        this.tecambio(usuname);
      }
    });
  }

  tecambio(usuname) {
    this.username = usuname;
    this.logsrv.getUsuback(this.username).subscribe(
      resu => {
        this.objUsu = resu;
        if (this.objUsu.enable === true) {
          this.objUsu.enable = false;
        } else {
          this.objUsu.enable = true;
        }
        this.ususrv.setUsuario(this.objUsu).subscribe(

          resul => {
            this.swaltit = 'Exito!';
            this.swalmsg = 'Usuaria/o fue modificado correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            //window.location.reload();
            this.ngOnInit();
          },
            error => {
              this.swaltit = 'Error!';
              this.swalmsg = 'Usuario/a no pudo ser modificado';
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
