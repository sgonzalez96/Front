import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dato } from '../models/dato';
import { LoginService } from '../../Tools/serv/login.service';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';


@Injectable({
  providedIn: 'root'
})
export class DatosService implements OnInit {
  url = '';

  constructor(
      private loginsrv: LoginService,
      private envsrv: EnvService,
      private http: HttpClient ) {
      this.url = this.envsrv.apiUrl;
   }

  ngOnInit() {
  }

  getDato(id: string): Observable<Dato> {
    
    let params = new HttpParams();
    params = params.append('datoId', id);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Dato>(this.url + 'getDato', {headers, params});
  }

  saveDato(dato: Dato) {
    this.loginsrv.validateToken();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setDato', dato, {headers});
  }

}
