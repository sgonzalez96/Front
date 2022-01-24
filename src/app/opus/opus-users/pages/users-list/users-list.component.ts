import { RolService } from './../../services/rol.service';
import { DTOUser } from './../../models/DTOUser';
import { LoginService } from 'src/app/opus/opus-users/services/login.service';
import { MenuService } from './../../services/menu.service';
import { Usuario } from 'src/app/opus/opus-users/models/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UtilesService } from '../../../commons/utiles.service';

import { UsersService } from '../../services/users.service';
import { Dtoitem } from '../../models/DtoItem';
import { Rol } from '../../models/rol';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  //pageSettings = pageSettings;
  lista: DTOUser[] = [];
  listaFilter: DTOUser[] = [];

  private usuario: Usuario = new Usuario;
  public objPermiso: Dtoitem = new Dtoitem;
  public currentRol : number = 0;
  public allrol: Rol[] = [];

  // filter data 
  public searchKey: string = "";

  constructor(private rolserv: RolService,private ususrv: UsersService, private utilser: UtilesService, private router: Router,private mensrv: MenuService,private logsrv: LoginService) {
    //this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    Swal.showLoading();
    this.fillData();
    this.getAllRol();

    //get permissions 
    this.usuario = this.logsrv.getUsuarioFromStorage();
    if (this.usuario.idUser) {
      this.mensrv.getPermiso(this.usuario.idUser, "usuarios").subscribe(
        resper => {
          this.objPermiso = resper;
          this.mensrv.checkAccessURL(this.objPermiso);
        }
      );
    }

  }
  getAllRol() {
    this.rolserv.getRoles().subscribe(res=>{
      if (res) {
        this.allrol = res;
      }
    })
  }


  fillData() {
    this.lista = [];
    this.ususrv.getUsuDtoByRol(this.currentRol).subscribe(
      resu => {
        this.lista = resu;
        this.listaFilter = resu;
        console.log(this.lista);
        Swal.close();
      }, error => {
        this.utilser.alertError('Error al leer los usuarios');
      }
    );
  }

  //filter by key
  filter(){
    this.listaFilter = this.lista.filter((item) => {
      if (item.userName.toLowerCase().startsWith(this.searchKey.toLowerCase()) ) {
        return true;
      }
      else if (item.nombreCompleto.toLowerCase().startsWith(this.searchKey.toLowerCase())){
        return true;
      } else{
        return false ;
       }
    });
    
   
  }

  changeFilter(rol: number){
    this.currentRol = rol;
    this.fillData();
  }

  createUser() {
    this.router.navigate(['/user/user-data/', 0]);
  }

  editUser(userId: number) {
    this.router.navigate(['/user/user-data/', userId]);
  }

  deleteUser(userToDelete: string) {
    Swal.fire({
      title: 'Seguro desea inhabilitar el usuario?',
      text: 'El nombre de usuario no podrá volver a ser utilizado nuevamente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ususrv.enableUser(userToDelete, false).subscribe(
          resu => {
            this.utilser.alertOK('Usuario inhabilitado con exito');
            this.fillData();
          }, error => {
            this.utilser.alertError('Hubo un problema al intentar inhabilitar el usuario');
          }
        );
      }
    });
  }

  activeUser(userToActive: string) {
    Swal.fire({
      title: 'Seguro desea habilitar el usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ususrv.enableUser(userToActive, true).subscribe(
          resu => {
            this.utilser.alertOK('Usuario habilitado con exito');
            this.fillData();
          }, error => {
            this.utilser.alertError('Hubo un problema al intentar habilitar el usuario');
          }
        );
      }
    });
  }

  resetPass(userToReset: any) {
    Swal.fire({
      title: 'Seguro desea resetear el password?',
      text: 'El nuevo password será el nombre de usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ususrv.resetPassword(userToReset).subscribe(
          resu => {
            this.utilser.alertOK('Password del usuario reseteado con exito');
          }, error => {
            this.utilser.alertError('Hubo un problema al intentar resetear el password');
          }
        );
      }
    });
  }
}
