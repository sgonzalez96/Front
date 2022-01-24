import { DTOUser } from './../models/DTOUser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Rol } from '../models/rol';
import { Usuario } from '../models/usuario';
import { EnvService } from '../../../env.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = '';

  constructor(private http: HttpClient, private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  // Usuarios

  findUserByUsername(username: string): Observable<Usuario> {
    let params = new HttpParams();
    params = params.append('username', username);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario>(this.url + 'users/findUser', {headers, params});
  }

  findUserById(userId: number): Observable<Usuario> {
    let params = new HttpParams();
    params = params.append('userId', userId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario>(this.url + 'users/findUserById', {headers, params});
  }

  getUsuRol(idRol: number): Observable<Usuario[]> {
    let params = new HttpParams();
    params = params.append('rolId', idRol.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario[]>(this.url + 'users/getUsuByRol', {headers, params});
  }


  getUserFromStorage(): Usuario {
    let usuario = new Usuario();
    if (sessionStorage.getItem('usuario') ) {
      let user: any;
      if (sessionStorage.getItem('usuario') !== null) {
        user = sessionStorage.getItem('usuario');
      }
      usuario = JSON.parse(user);
      Object.setPrototypeOf(usuario, Usuario.prototype);
    }
    return usuario;
  }

  findAllUsers(): Observable<Usuario[]> {
    let params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario[]>(this.url + 'users/findAllUsers', {headers, params});
  }

  enableUser(username: string, enable: boolean): Observable<Usuario> {
    let params = new HttpParams();
    params = params.append('username', username);
    params = params.append('enable', enable.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.post<Usuario>(this.url + 'users/enableUser', null, {headers, params});
  }

  resetPassword(username: string): Observable<Usuario> {
    let params = new HttpParams();
    params = params.append('username', username);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.post<Usuario>(this.url + 'users/resetPass', null, {headers, params});
  }

  createUser(user: Usuario): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

    return this.http.post<Usuario>(this.url + 'users/createUser', user, {headers});
  }

  editUser(user: Usuario): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

    return this.http.post<Usuario>(this.url + 'users/modifyUser', user, {headers});
  }

  changePassword(user: Usuario): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<Usuario>(this.url + 'users/changePass', user, {headers});
  }

  // Roles

  findAllRols(): Observable<Rol[]> {
    const params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Rol[]>(this.url + 'roles/findRols', {headers, params});
  }

  findRolById(rolId: number): Observable<Rol> {
    let params = new HttpParams();
    params = params.append('rolId', rolId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Rol>(this.url + 'roles/findrolById', {headers, params});
  }

  saveRol(rol: Rol): Observable<Rol> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<Rol>(this.url + 'roles/saveRol', rol, {headers});
  }

  //get list user by rol  getUsuDtoByRol
  getUsuDtoByRol(rolId: number): Observable<DTOUser[]> {
    let params = new HttpParams();
    params = params.append('rolId', rolId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<DTOUser[]>(this.url + 'users/getUsuDtoByRol', {headers, params});
  }
}
