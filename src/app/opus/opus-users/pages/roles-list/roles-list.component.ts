import { LoginService } from 'src/app/opus/opus-users/services/login.service';
import { MenuService } from './../../services/menu.service';
import { Usuario } from 'src/app/opus/opus-users/models/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Rol } from '../../models/rol';
import { UsersService } from '../../services/users.service';
import { Dtoitem } from '../../models/DtoItem';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {

   roles: Rol[] = [];

   private usuario: Usuario = new Usuario;
   public objPermiso: Dtoitem = new Dtoitem;

  constructor(private ususer: UsersService, private router: Router,private mensrv: MenuService,private logsrv: LoginService) {
    //this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    Swal.showLoading();
    this.ususer.findAllRols().subscribe((resu)=>{
      this.roles = resu;
      Swal.close();
    });

    
    //get permissions 
    this.usuario = this.logsrv.getUsuarioFromStorage();
    if (this.usuario.idUser) {
      this.mensrv.getPermiso(this.usuario.idUser, "roles").subscribe(
        resper => {
          this.objPermiso = resper;
          this.mensrv.checkAccessURL(this.objPermiso);
        }
      );
    }
  }

  createRol() {
    this.router.navigate(['/user/role-data/', 0]);
  }

  editRol(rolId: number) {
    this.router.navigate(['/user/role-data/', rolId]);
  }

}
