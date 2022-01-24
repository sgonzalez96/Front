import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { Delegado } from '../models/delegado';

@Injectable({
  providedIn: 'root'
})
export class DelegadosService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getDelegados(): Observable<Delegado[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Delegado[]>(this.url + 'getDelegados', {headers, params});
  }

  getDelNuc(nucId: number): Observable<Delegado[]> {
    let params = new HttpParams();
    params = params.append('nucId', nucId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Delegado[]>(this.url + 'getDelNuc', {headers, params});
  }

  getDelAfi(cedula: string): Observable<Delegado[]> {
    let params = new HttpParams();
    params = params.append('cedula', cedula);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Delegado[]>(this.url + 'getDelAfi', {headers, params});
  }

  getDelegado(delId: number): Observable<Delegado> {
    let params = new HttpParams();
    params = params.append('delId', delId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Delegado>(this.url + 'getDelegado', {headers, params});
  }

  saveDelegado(objDel: Delegado) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setDelegado', objDel, {headers});
  }

  deleteDelegado(delId: number) {
    let params = new HttpParams();
    params = params.append('delId', delId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteDelegado', null, {headers, params});

  }

}
