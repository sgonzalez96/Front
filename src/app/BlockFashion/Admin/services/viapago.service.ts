import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Via } from '../models/via';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViapagoService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getVias(): Observable<Via[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Via[]>(this.url + 'getVias', {headers, params});
  }

  getVia(viaId: string): Observable<Via> {
    let params = new HttpParams();
    params = params.append('viaId', viaId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Via>(this.url + 'getVia', {headers, params});
  }

  saveVia(via: Via) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setVia', via, {headers});
  }

  deleteVia(idVia: string){
    let params = new HttpParams();
    params = params.append('viaId', idVia);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteVia', null, {headers, params});

  }

}
