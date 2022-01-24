import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { BcoMov } from '../models/bcomov';

@Injectable({
  providedIn: 'root'
})
export class MovbcoService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getMovs(fecini, fecfin,estini,estfin,viaini,viafin): Observable<BcoMov[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('estini', estini);
    params = params.append('estfin', estfin);
    params = params.append('viaini', viaini);
    params = params.append('viafin', viafin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoMov[]>(this.url + 'getMovsBco', {headers, params});
  }


  getMovBco(movId: string): Observable<BcoMov> {
    let params = new HttpParams();
    params = params.append('movId', movId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoMov>(this.url + 'getMovBco', {headers, params});
  }
  // mas de un movimiento seleccionado para un solo recibo
  getSeveralMovBco(movId: number[]): Observable<BcoMov[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.post<BcoMov[]>(this.url + 'getSeveralMovBco', movId ,{headers});
  }

  saveMovBco(mov: BcoMov) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setMovBco', mov, {headers});
  }

  deleteMovBco(movId: string){
    let params = new HttpParams();
    params = params.append('movId', movId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteMovBco', null, {headers, params});
  }

  saveMovBcoLis(lismov: BcoMov[]) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'saveMovBcoLis', lismov, {headers});
  }

  deleteMovBcoLis(lismov: BcoMov[]) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'delMovBcoLis', lismov, {headers});
  }

}

