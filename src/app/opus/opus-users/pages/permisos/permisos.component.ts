import { NgForm } from '@angular/forms';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Dtoitem } from '../../models/DtoItem';
import { Dtomenu } from '../../models/DtoMenu';
import { Rol } from '../../models/rol';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { MenuService } from '../../services/menu.service';
import { RolService } from '../../services/rol.service';
import { UsersService } from '../../services/users.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit {

  @ViewChild('modalDialog') details!: ElementRef;

  varsRol: Rol[] = [];
  varsUsu: Usuario[] = [];
  elrol: Rol = new Rol;
  elusu: Usuario = new Usuario;
  lista: Dtomenu[] = [];
  varol = false;
  vausu = false;

  frm_nombre = '';
  frm_comentario = '';
  frm_email = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  objItem: Dtoitem = new Dtoitem;
  indefhab: boolean = false;
  closeResult = '';
  // objDato: Dato = new Dato;
  titulo = '';
  objPermiso: Dtoitem = new Dtoitem;
  miusu: Usuario = new Usuario;
  
  //buttton check all 
  public titleButtonCheckAll: string = "";
  public iconButtonCheckAll: string = "";



  constructor(
    private ususrv: UsersService,
    private rolsrv: RolService,
    private modalService: NgbModal,
    private logsrv: LoginService,
    private mensrv: MenuService,
    private _snotify: SnotifyService
  ) { }

  ngOnInit(): void {

    this.elrol = new Rol();
    this.elrol.idRol = 0;
    this.elrol.descripcion = 'Ningún rol específico';
    this.varsRol = []
    this.varsRol.push(this.elrol);
    this.miusu = this.logsrv.getUsuarioFromStorage();
    if (this.miusu.idUser) {
      this.mensrv.getPermiso(this.miusu.idUser, "gral_permisos").subscribe(
        resper => {
          this.objPermiso = resper;
          this.mensrv.checkAccessURL(this.objPermiso);
        }
      );
    }

    this.rolsrv.getRoles().subscribe(
      resrol => {
        this.varsRol = this.varsRol.concat(resrol);
      }
    );
    this.cargoUsuarios();

  }
  // load data to the select
  cargoUsuarios() {
    Swal.showLoading();
    this.varsUsu = [];
    if (this.elrol.idRol === 0) {
      this.ususrv.findAllUsers().subscribe(
        resusu => {
          this.varsUsu = resusu;
          this.elusu = this.varsUsu[0];
          this.cargoMenu();
          Swal.close();
        }
      );
    } else {
      this.elusu = new Usuario();
      this.elusu.idUser = 0;
      this.elusu.nombreCompleto = 'Todos los usuarios del rol [' + this.elrol.descripcion + ']';
      this.varsUsu.push(this.elusu);
      // load menu by default
      this.cargoMenu();
      if (this.elrol.idRol) {
        this.ususrv.getUsuRol(this.elrol.idRol).subscribe(
          resusu => {
            this.varsUsu = this.varsUsu.concat(resusu);

          }
        );

      }

    }
  };

  //load menu by default
  cargoMenu() {
    Swal.showLoading();
    this.lista = [];
    if (this.elrol.idRol === 0) {
      this.varol = false;
    } else {
      this.varol = true;
    }
    if (this.elusu.idUser === 0) {
      this.vausu = false;
    } else {
      this.vausu = true;
    }

    if (this.elrol.idRol != undefined && this.elusu.idUser != undefined) {
      this.mensrv.getMenuTotal(this.elrol.idRol, this.elusu.idUser).subscribe(
        resmen => {
          this.lista = resmen;
          console.log("me viene permiso");
          console.log(this.lista);
          Swal.close();

        }, error => {
          Swal.close();
          console.log(error);
        }
      );
    }




  }

  //change rol from select
  onChangeRol(elRol: string) {
    this.cargoUsuarios();
    // for (let valRol of this.varsRol) {
    //   if (valRol.descripcion) {
    //     if (valRol.descripcion.trim() === elRol.trim()) {
    //       this.elrol = valRol;
    //       break;
    //     }
    //   }

    // }
  }

  //change user from select
  onChangeUsu(elUsu: string) {
    // this.elrol = this.varsRol[0];
    this.cargoMenu();
    // for (let valUsu of this.varsUsu) {
    //   if (valUsu.nombreCompleto) {
    //     if (valUsu.nombreCompleto.trim() === elUsu.trim()) {
    //       this.elusu = valUsu;
    //       break;
    //     }
    //   }

    // }
  }

  edito(f: NgForm) {
    console.log(this.objItem);
    this.mensrv.savePermiso(this.objItem).subscribe(
      resu => {
        this.modalService.dismissAll();
        this.cargoMenu();
      }
    );
  }

  // showing user's and rols access within modal
  ite_open(content: ElementRef, elhijo: Dtoitem) {
    this.objItem = elhijo;
    if (this.elusu.idUser !== 0) {
      this.titulo = 'Permisos para usuario ' + this.elusu.nombreCompleto + ' en  ' + this.objItem.descripcion;
    } else {
      this.titulo = 'Permisos para rol ' + this.elrol.descripcion + ' en  ' + this.objItem.descripcion;
    }
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //it's part of modal
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // Swal alert to add access or not
  acceso(elhijo: Dtoitem) {
    this.objItem = elhijo;
    this.objItem.fkusu = this.elusu.idUser;
    this.swaltit = '¿Desea dar acceso a ' + this.objItem.descripcion + ' ?';
    if (this.elusu.idUser != 0) {
      this.swalmsg = 'El usuario ' + this.elusu.nombreCompleto + ' tendrá acceso al ítem ';
    } else {
      this.swalmsg = 'El rol ' + this.elrol.descripcion + ' tendrá acceso al ítem';
    }
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log(this.objItem);
        this.objItem.accede = true;
        this.objItem.edicion  = true;
        this.objItem.visualizacion = true;
        this.objItem.borrado = true;
        this.objItem.creacion = true;
        this.objItem.funcion1 = true;
        this.objItem.emision = true;
        // -- programar acceso --- \\
        this.mensrv.savePermiso(this.objItem).subscribe(
          resu => {
            this.ite_open(this.details,this.objItem);
            // this.cargoMenu();
          }
        );

      }
    });

  }

  //button all access 
  allAccess(items: Dtoitem[], flag: boolean){
    this.swalmsg = "Desea habilitar todos los item";
    if (!flag) {
      this.swalmsg = "Desea inhabilitar todos los item";
    }
    Swal.fire({
      titleText: "Alerta",
      text: this.swalmsg,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log(items);
        this.objItem.accede = true;
        // -- programar acceso --- \\
        Swal.showLoading();
        this.mensrv.AccessGroupItems(items,flag).subscribe(
          resu => {
            if (resu) {
              this._snotify.success("Fueron actualizados todos los item","Exito!");
              this.cargoMenu();
            }
          },err=>{
            console.log(err);
            Swal.fire("Error","No se pudo completar la accion","error");
          }
        );

      }
    });
  }

  // delete access definition
  borrar(elhijo: Dtoitem) {
    this.objItem = elhijo;
    this.swaltit = '¿Desea eliminar configuración del ítem ' + this.objItem.descripcion + ' ?';
    if (this.elusu.idUser != 0) {
      this.swalmsg = 'El usuario ' + this.elusu.nombreCompleto + ' no tendrá configuración propia ';
    } else {
      this.swalmsg = 'El rol ' + this.elrol.descripcion + ' no tendrá configuración propia';
    }
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.mensrv.deletePermiso(this.objItem).subscribe(
          resu => {
            this.cargoMenu();
          }
        );
      }
    });
  }

  // enabled and disabled access
  bloqueo(elhijo: Dtoitem) {
    this.objItem = elhijo;
    this.objItem.fkusu = this.elusu.idUser;
    this.swaltit = '¿Desea bloquear acceso a ' + this.objItem.descripcion + ' ?';
    if (this.elusu.idUser != 0) {
      this.swalmsg = 'El usuario ' + this.elusu.nombreCompleto + ' no tendrá acceso al ítem ';
    } else {
      this.swalmsg = 'El rol ' + this.elrol.descripcion + ' no tendrá acceso al ítem';
    }
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log(this.objItem);
        this.objItem.accede = false;
        // -- programar acceso --- \\
        this.mensrv.savePermiso(this.objItem).subscribe(
          resu => {
            this.cargoMenu();
          }
        );

      }
    });
  }

}
