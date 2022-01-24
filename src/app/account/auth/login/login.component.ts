import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { LAYOUT_MODE } from '../../../layouts/layouts.model';
import { Usuario } from 'src/app/opus/opus-users/models/usuario';
import { UtilesService } from 'src/app/opus/commons/utiles.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/opus/opus-users/services/login.service';
import { UsersService } from 'src/app/opus/opus-users/services/users.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  @ViewChild('dialogpin', {static: false}) dialogpin: TemplateRef<NgbModal> | undefined;

  modalrefpin: NgbModalRef | undefined;

  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  loginForm!: FormGroup;
  submitted = false;
  // returnUrl!: string;
  error = '';

  // data de jose
  username = '';
  password = '';
  usuario = new Usuario();
  pin = '';

  constructor(
    private router: Router,
    private logser: LoginService,
    private ususer: UsersService,
    private utiser: UtilesService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private _cookies: CookieService) {
      //Validation Set
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required,]],
      password: ['', [Validators.required]],
      remember:[false]
    });

    this.f.username.setValue(this.userCookies);
    this.f.password.setValue(this.passCookies);
    this.f.remember.setValue(this.rememberCookies);
  }




  ngOnInit(): void {
    sessionStorage.clear();
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
    

  }



  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  formSubmit() {
    this.username= this.f.username.value;
    this.password= this.f.password.value;

    //verific if I have save credentials within cookies
    if (this.f.remember.value) {
      this._cookies.set('user',`${this.username}`);
      this._cookies.set('pass',`${this.password}`);
      this._cookies.set('remember',`${this.f.remember.value}`);
    } else {
      this._cookies.delete('user');
      this._cookies.delete('pass');
      this._cookies.delete('remember');
    }

    if (true) {
      console.log("por acano ");
      this.logser.requireDobleAuth(this.username).subscribe(
        resu => {
          if (resu == null) {
            this.utiser.alertWarning('Credenciales incorrectas');
          } else {
            if (resu) {
              this.dobleAuth();
            } else {
              this.toLogin('', 'Credenciales incorrectas');
            }
          }
        }, error => {
          this.utiser.alertWarning('Error en detectar doble autentificaion ');
        }
      );
    } else {
      this.utiser.alertWarning('Debe ingresar todos los datos solicitados');
    }
  }

  dobleAuth() {
    this.logser.generoPin(this.username, this.password).subscribe(
      resu => {
        this.modalrefpin = this.modalService.open(this.dialogpin, {backdrop: 'static', size: 'lg', keyboard: false, centered: true});
      }, error => {
        this.utiser.alertWarning('Credenciales incorrectas');
      }
    );
  }

  toLogin(elpin: string, mensaje: string) {
    console.log('en tu login');
    this.logser.login(this.username, this.password, elpin).subscribe(
      resu => {
        console.log('el resu es');
        if (resu == null) {
          this.utiser.alertWarning(mensaje);
          this.usuario = new Usuario();
        } else {
          this.logser.setToken(resu.access_token);
          this.guardoUsuario();
        }
      }, error => {
        console.log('error tologin');
        console.log(error);
        this.utiser.alertWarning(mensaje);
        this.usuario = new Usuario();
      }
    );
  }

  confPin() {
    if (this.modalrefpin !== undefined) {
      this.modalrefpin.close();
    }
    this.toLogin(this.pin, 'El pin ingresado es incorrecto o ha espirado');
  }

  guardoUsuario() {
    this.ususer.findUserByUsername(this.username).subscribe(
      resu => {
        this.usuario = resu;
        this.logser.setUser(this.usuario);
        console.log('llendo al home ');
        this.router.navigate(['home']);
      }, error => {
        this.utiser.alertError('Error al intentar recuperar los datos de usuario');
      }
    );
  }

  // manage cookies
  public get userCookies() : string {
    let user = this._cookies.get('user');
    if (user) {
      return user
    }else{ return ''}
  }
  public get passCookies() : string {
    let pass = this._cookies.get('pass');
    if (pass) {
      return pass
    }else{ return ''}
  }
  public get rememberCookies() : string {
    let pass = this._cookies.get('pass');
    if (pass) {
      return pass
    }else{ return ''}
  }


}
