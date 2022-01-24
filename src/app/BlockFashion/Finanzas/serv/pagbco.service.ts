import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { BcoPago } from '../models/bcopago';

@Injectable({
  providedIn: 'root'
})
export class PagbcoService {
  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getPagos(fecini, fecfin,estini,estfin,viaini,viafin): Observable<BcoPago[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('estini', estini);
    params = params.append('estfin', estfin);
    params = params.append('viaini', viaini);
    params = params.append('viafin', viafin);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoPago[]>(this.url + 'getMovsBcoPago', {headers, params});
  }

  getPagosNuc(nucId,fecini, fecfin,estini,estfin,viaini,viafin): Observable<BcoPago[]> {
    let  params = new HttpParams();
    params = params.append('nucId', nucId);
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('estini', estini);
    params = params.append('estfin', estfin);
    params = params.append('viaini', viaini);
    params = params.append('viafin', viafin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoPago[]>(this.url + 'getMovsBcoPagoNuc', {headers, params});
  }

  getPagosAfi(cedula,fecini, fecfin,estini,estfin,viaini,viafin): Observable<BcoPago[]> {
    let  params = new HttpParams();
    params = params.append('cedula', cedula);
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('estini', estini);
    params = params.append('estfin', estfin);
    params = params.append('viaini', viaini);
    params = params.append('viafin', viafin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoPago[]>(this.url + 'getMovsBcoPagoAfi', {headers, params});
  }

  getPagoBco(pagoId: string): Observable<BcoPago> {
    let params = new HttpParams();
    params = params.append('pagoId', pagoId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<BcoPago>(this.url + 'getMovBcoPago', {headers, params});
  }

  savePagoBco(pago: BcoPago) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setMovBcoPago', pago, {headers});
  }

  deletePagoBco(pagoId: string){
    let params = new HttpParams();
    params = params.append('pagoId', pagoId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteMovBcoPago', null, {headers, params});
  }
}
