import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Moneda } from '../models/moneda';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';

@Injectable({
  providedIn: 'root'
})
export class MonedaService  {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getMonedas(): Observable<Moneda[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Moneda[]>(this.url + 'getMonOrd', {headers, params});
  }

  getMoneda(monId: string): Observable<Moneda> {
    let params = new HttpParams();
    params = params.append('monId', monId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Moneda>(this.url + 'getMoneda', {headers, params});
  }

  saveMoneda(moneda: Moneda) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setMoneda', moneda, {headers});
  }

  deleteMoneda(idMoneda: string){
    let params = new HttpParams();
    params = params.append('monId', idMoneda);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteMoneda', null, {headers, params});

  }

}
