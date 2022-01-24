import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilesService } from '../../../commons/utiles.service';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  user = new Usuario();
  passnew = '';
  passconf = '';

  constructor(private admsrv: UsersService, private utiser: UtilesService, private logser: LoginService) {
    //this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    this.user = this.admsrv.getUserFromStorage();
  }

  changePass(f: NgForm) {
    let oki: boolean = this.camposIngresados();
    if (oki) {
      oki = this.passCoinciden();
      if (oki) {
        this.cambioPass();
      }
    }
  }

  passCoinciden(): boolean {
    if (this.passnew !== this.passconf) {
      this.utiser.alertWarning('Las contraseñas ingresadas no coinciden');
      return false;
    }
    return true;
  }

  camposIngresados(): boolean {
    if (this.passnew == null || this.passnew === '' || this.passconf == null || this.passconf === '') {
      this.utiser.alertWarning('Debe ingresar todos los campos requeridos');
        return false;
    }
    return true;
  }

  cambioPass() {
    this.user.password = this.passnew;
    this.admsrv.changePassword(this.user).subscribe(
      resul => {
        this.logser.setUser(resul);
        this.utiser.alertOK('Password modificado con exito');
        this.passnew = '';
        this.passconf = '';
      }, error => {
        this.utiser.alertError('No se pudo modificar el password');
      }
    );
  }

}
