import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Rol } from '../models/rol';
import { LoginService } from './login.service';
import { EnvService } from 'src/app/env.service';

@Injectable({
  providedIn: 'root'
})

export class RolService implements OnInit {

  url = '';

  constructor( private http: HttpClient,
              private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  ngOnInit() {
  }

  getRoles(): Observable<Rol[]> {
    const params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Rol[]>(this.url + 'roles/findRols', {headers, params});
  }

  getRol(rolId: string): Observable<Rol> {
    let params = new HttpParams();
    params = params.append('rolId', rolId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Rol>(this.url + 'getRol', {headers, params});
  }

  saveRol(rol: Rol) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setRol', rol, {headers});
  }

  // deleteRol(idRol: string) {
  //   this.loginsrv.validateToken();
  //   let params = new HttpParams();
  //   params = params.append('rolId', idRol);
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
  //   return this.http.post<any>(this.url + 'deleteRol', null, {headers, params});

  // }
}
