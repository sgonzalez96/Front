import { Injectable, OnInit } from '@angular/core';
import { Usuario } from '../../Admin/models/usuario';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { EnvService } from './env.service';
import { Observable } from 'rxjs';
import { AppPayload } from '../../Admin/models/payload';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit {
  url = '';
  logueado = false;
  usuario: Usuario = new Usuario();
  swaltit: string;
  swalmsg: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;


  }

  ngOnInit() {

  }


  checkeoAcceso(usu: string, pass: string): Observable<any> {
    const urlLogin = this.envsrv.apiAuth;
    const credenciales = btoa('ticket' + ':' + '12345');
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + credenciales,
      })

    };

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usu);
    params.set('password', pass);

    console.log(params);
    return this.http.post<any>(urlLogin, params.toString(), httpOption);
  }

  getUsuback(usu: string): Observable<Usuario> {
    //console.log("***EN EN USUBACK: "+usu+"//"+this.url);
    let params = new HttpParams();
    params = params.append('usu', usu);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario>(this.url + 'getUsuario', { headers, params });
  }

  getUsuarioFromStorage(): Usuario {
    if (sessionStorage.getItem('usuario')) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      Object.setPrototypeOf(this.usuario, Usuario.prototype);
    }
    return this.usuario;
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string {
    return sessionStorage.getItem('token');
  }
  setRefreshToken(token: string) {
    sessionStorage.setItem('refresh_token', token);
  }

  getRefreshToken(): string {
    return sessionStorage.getItem('refresh_token');
  }

  guardarUsuario(usu: string) {
    //    console.log('en el guardar usuario '+usu);
    this.getUsuback(usu).subscribe(
      resp => {
        //        console.log('consulto al usuback')
        //        console.log(JSON.stringify(resp));
        sessionStorage.setItem('usuario', JSON.stringify(resp));
      },
      error => {
        alert(error);
      }
    );
  }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  validateToken() {
    const token = this.getToken();
    const artok = token.split('\.');
    const payload = atob(artok[1]);
    const payl: AppPayload = JSON.parse(payload);
    const fec = new Date(payl.exp * 1000);
    const ahora = new Date();
    const dife = fec.getTime() - ahora.getTime();

    if (dife < 0) {
      this.router.navigate(['/logppal']);
      this.swaltit = 'Error!';
      this.swalmsg = 'La sesión ha expirado, debe reingresar ... ';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'error',
        confirmButtonText: 'OK',
      });
    }
    /*
    else if (dife < 300000) {
        let reftok = this.getRefreshToken();
        console.log('mi token de refresco es');
        console.log(reftok);
        this.refreshToken(reftok).subscribe(
          res => {
            console.log('************ a refrescar el token');
            this.setRefreshToken(res.refresh_token);
            this.setToken(res.access_token);
          }
        );
    }
    console.log("*** "+fec);
    console.log("### Ahora: "+ahora);
    */
  }

  refreshToken(tok: string) {

    const urlLogin = this.envsrv.apiAuth;
    const credenciales = btoa('ticket' + ':' + '12345');
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + credenciales,
      })

    };
    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', tok);
    //    console.log('te refresco*********');
    //    console.log(tok);

    return this.http.post<any>(urlLogin, params.toString(), httpOption);
  }



}

