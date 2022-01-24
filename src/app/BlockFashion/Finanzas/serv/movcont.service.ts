
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { MovCont } from '../models/movcont';
import { MovContDet } from '../models/movcondet';
import { Afiliadoindi } from '../../Afiliados/models/afiliadoindi';
import { MovConDetFullDTO } from '../models/excelRecibos';

@Injectable({
  providedIn: 'root'
})
export class MovcontService {
  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getMovs(fecini, fecfin,tipini,tipfin): Observable<MovCont[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('tipini', tipini);
    params = params.append('tipfin', tipfin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovCont[]>(this.url + 'getMovs', {headers, params});
  }

  getPagoIndividual(fecini): Observable<Afiliadoindi[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Afiliadoindi[]>(this.url + 'getPagoIndividual', {headers, params});
  }


  getMovsVia(fecini, fecfin, via, tipini, tipfin): Observable<MovCont[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('via', via);
    params = params.append('tipini', tipini);
    params = params.append('tipfin', tipfin);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovCont[]>(this.url + 'getMovsVia', {headers, params});
  }

  getMovsNucleo(nucleo, fecini, fecfin): Observable<MovContDet[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('nucleo', nucleo);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovContDet[]>(this.url + 'getMovsNucleo', {headers, params});
  }

  getMovsAfil(cedula, fecini, fecfin): Observable<MovContDet[]> {
    let  params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('cedula', cedula);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovContDet[]>(this.url + 'getMovsAfil', {headers, params});
  }
  //validar para borrar recibo
  validarBajaMovCont(recId:number): Observable<boolean> {
    let  params = new HttpParams();

    params = params.append('recId', recId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<boolean>(this.url + 'validarBajaMovCont', {headers, params});
  }


  getMovcont(movId: string): Observable<MovCont> {
    let params = new HttpParams();
    params = params.append('movId', movId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovCont>(this.url + 'getMovcont', {headers, params});
  }
  // get movcont from nucleos
  getMovcontNucleos(data: any): Observable<MovCont[]> {
    console.log(data);
    let params = new HttpParams();
    params = params.append('fecini', data.fecini);
    params = params.append('fecfin', data.fecfin);
    params = params.append('nucleo', data.nucleo);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<MovCont[]>(this.url + 'getRecibosNucleo', {headers, params});
  }


  getSaldo(via: string, fecha: string): Observable<number> {
    let params = new HttpParams();
    params = params.append('fecini', fecha);
    params = params.append('via', via);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<number>(this.url + 'getSaldo', {headers, params});
  }


  chkDetalle(deta: MovContDet): Observable<MovContDet> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.post<MovContDet>(this.url + 'chkDetalle',deta, {headers});
  }

  saveMovcont(mov: MovCont) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setMovcont', mov, {headers});
  }

  // queries last receipt
  getDateLastReceipt(viaPago:number): Observable<Date> {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('viaPago', viaPago.toString());
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Date>(this.url + 'getFechaUltRec', {headers,params});
  }

  deleteMovcont(movId: string){
    let params = new HttpParams();
    params = params.append('movId', movId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteMovcont', null, {headers, params});
  }

  //get list MovConDetFullDTO
  getMovsDTO(fecini:string,fecfin: string, tipini: string, tipfin: string, via: number): Observable<MovConDetFullDTO[]> {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('tipini', tipini);
    params = params.append('tipfin', tipfin);
    params = params.append('via', via.toString());
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<MovConDetFullDTO[]>(this.url + 'getMovsDTO', {headers,params});
  }


}
