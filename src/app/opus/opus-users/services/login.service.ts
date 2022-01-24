import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario';
import { EnvService } from '../../../env.service';

@Injectable({ providedIn: 'root' })
export class LoginService {

  url = '';
  urlauth = '';
  usuario: Usuario = new Usuario();


  constructor(private http: HttpClient, private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
    this.urlauth = this.envsrv.apiAuth;
  }

  login(usu: string, pass: string, pin: string): Observable<any>{
    const credenciales = btoa('ticket' + ':' + '12345');
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + credenciales,
      })

    };

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username' , usu);
    params.set('password' , pass);
    params.set('pintoken' , pin);
    console.log("vamos al standars " + this.urlauth);
    console.log("otras " + usu + ' ' + pass + ' ' + pin);
    return this.http.post<any>(this.urlauth, params.toString(), httpOption);
  }

  generoPin(usu: string, pass: string): Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/x-www-form-urlencoded'
      })
    };

    const params = new URLSearchParams();
    params.set('username' , usu);
    params.set('pass' , pass);

    return this.http.post<any>(this.url + 'users/genpin', params.toString(), httpOption);
  }

  requireDobleAuth(usu: string): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('username', usu);

    let headers = new HttpHeaders();
    // headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<boolean>(this.url + 'users/requireDobleAuth', {headers, params});
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setUser(usu: Usuario) {
    sessionStorage.setItem('usuario', JSON.stringify(usu));
  }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  getUsuarioFromStorage(): Usuario {
    if (sessionStorage.getItem('usuario')) {
      const ses_usu = sessionStorage.getItem('usuario');
      if (ses_usu  != null) {
        this.usuario = JSON.parse(ses_usu);
        Object.setPrototypeOf(this.usuario, Usuario.prototype);
      }
    }
    return this.usuario;
  }

  

}
