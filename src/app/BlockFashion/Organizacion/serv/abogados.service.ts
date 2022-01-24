import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { Abogado } from '../models/abogado';

@Injectable({
  providedIn: 'root'
})
export class AbogadosService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getAbogados(): Observable<Abogado[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Abogado[]>(this.url + 'getAbogados', {headers, params});
  }

  getAbogado(aboId: number): Observable<Abogado> {
    let params = new HttpParams();
    params = params.append('aboId', aboId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Abogado>(this.url + 'getAbogado', {headers, params});
  }

  saveAbogado(abogado: Abogado) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setAbogado', abogado, {headers});
  }

}
