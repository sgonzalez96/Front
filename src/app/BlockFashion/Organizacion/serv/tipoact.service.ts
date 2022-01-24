import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { TipoAct } from '../models/tipoact';

@Injectable({
  providedIn: 'root'
})
export class TipoactService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getTipoActividades(): Observable<TipoAct[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<TipoAct[]>(this.url + 'getTipoActividades', {headers, params});
  }

  getTipoAct(tipId: string): Observable<TipoAct> {
    let params = new HttpParams();
    params = params.append('tipId', tipId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<TipoAct>(this.url + 'getTipoAct', {headers, params});
  }

  saveTipoAct(tipoact: TipoAct) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setTipoAct', tipoact, {headers});
  }

  deleteTipoAct(idTipo: string){
    let params = new HttpParams();
    params = params.append('tipId', idTipo);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteTipoAct', null, {headers, params});
  }

}
