import { Afiliado } from './../models/afiliado';
import { Order } from './../models/AfilProdDTO';
import { Injectable } from '@angular/core';
import { LoginService } from '../../Tools/serv/login.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { AfilNucleo } from '../models/afilnuc';
import { AfilDto } from '../models/afildto';
import { Nucleo } from '../models/nucleo';
import { AfilNota } from '../models/afilnota';
import { AfilProdDTO } from '../models/AfilProdDTO';
import { IReportAfilProd } from '../models/reportAfilProd';

@Injectable({
  providedIn: 'root'
})
export class AfiliadosService {
  url = '';
  getListAfilDTO: any;

  constructor(
    private logsrv: LoginService,
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getAfiliados(soloActivos, search): Observable<Afiliado[]> {
    let params = new HttpParams();
    params = params.append('soloActivos', soloActivos);
    params = params.append('search', search);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Afiliado[]>(this.url + 'getAfiliados', {headers, params});
  }

  getListaAfi(): Observable<Afiliado[]> {
    let params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Afiliado[]>(this.url + 'getListaAfi', {headers, params});
  }


  getAfiliado(afiId: string): Observable<Afiliado> {
    let params = new HttpParams();
    params = params.append('afiId', afiId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Afiliado>(this.url + 'getAfiliado', {headers, params});
  }

  saveAfiliado(afildto: AfilDto) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setAfiliado', afildto, {headers, params});
  }
  //check afil padron
  checkAfilPadron(afil: Afiliado) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'checkAfilPadron', afil, {headers, params});
  }

  isValidCi(ci: string): boolean {
    let valid = false;

    if (ci.length < 6) {
      return false;
    }

    const digVerificadorString = ci.charAt(ci.length - 1);
    const digitoVerificador = +digVerificadorString;
    let factores: number[] = [];
    if (ci.length === 7) { // CI viejas
        factores = [9, 8, 7, 6, 3, 4];
    } else {
        factores = [2, 9, 8, 7, 6, 3, 4];
    }

    let suma = 0;
    for (let i = 0; i < ci.length - 1; i++) {
      const digitostring = ci.charAt(i);
      const digito = +digitostring;
      suma += digito * factores[i];
    }

    const resto = suma % 10;
    let checkdigit = 10 - resto;

    if (checkdigit === 10) {
        checkdigit = 0;
    }

    let digitoveri = 0;
    if (ci.length === 7) {
      const digitoveristring = ci.substring(6);
      digitoveri = +digitoveristring;
    } else {
      const digitoveristring = ci.substring(7);
      digitoveri = +digitoveristring;
    }

    if (checkdigit === digitoveri) {
        valid = true;
    }

    return valid;
  }

  

  solicitud(afildto: AfilDto) {
    let headers = new HttpHeaders();
    return this.http.post<any>(this.url + 'solicitud', afildto);
  }

  isAfiliado(afiId: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('cedula', afiId);
    let headers = new HttpHeaders();
    return this.http.get<boolean>(this.url + 'isAfiliado', {headers, params});
  }

  getNucDTO(): Observable<Nucleo[]> {
    let params = new HttpParams();
    let headers = new HttpHeaders();
    return this.http.get<Nucleo[]>(this.url + 'getNucDTO', {headers, params});
  }

  getAfiNucleo(nucId): Observable<AfilNucleo[]> {
    let params = new HttpParams();
    params = params.append('nucId', nucId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilNucleo[]>(this.url + 'getAfiNucleo', {headers, params});
  }

  getNucAfiliado(cedula): Observable<AfilNucleo[]> {
    let params = new HttpParams();
    params = params.append('cedula', cedula);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilNucleo[]>(this.url + 'getNucAfiliado', {headers, params});
  }
  
  getNotas(ent,idtabla,maxniv): Observable<AfilNota[]> {
    let params = new HttpParams();
    params = params.append('ent', ent);
    params = params.append('tabId', idtabla);
    params = params.append('nivmax', maxniv);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilNota[]>(this.url + 'getNotas', {headers, params});
  }

  getNota(notaId): Observable<AfilNota> {
    let params = new HttpParams();
    params = params.append('notaId', notaId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilNota>(this.url + 'getNota', {headers, params});
  }

  saveNota(nota: AfilNota) {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setNota', nota, {headers, params});
  }
  // get list AfilProdDTO
  getListAfilProdDTO(nucId: number): Observable<AfilProdDTO[]> {
    let params = new HttpParams();
    params = params.append("nucId",nucId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilProdDTO[]>(this.url + 'getListAfilProdDTO', {headers, params});
  }

  // clean product to afil from cedula 
  clearAfilProd(cedula: string): Observable<AfilProdDTO[]> {
    let params = new HttpParams();
    params = params.append("cedula", cedula);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilProdDTO[]>(this.url + 'cleanAfilProduct', {headers, params});
  }

  //add prod to afil 
  addProductToAfil(cedula: string, obj: Order): Observable<AfilProdDTO[]> {
    let params = new HttpParams();
    params = params.append("cedula", cedula);
    params = params.append("producto", obj.producto);
    params = params.append("fechaAsig", obj.fechaAsig);
    params = params.append("caracteristicas", obj.caracteristicas);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<AfilProdDTO[]>(this.url + 'addProductToAfil', {headers, params});
  }

  //get report to AfilProd  IReportAfilProd
  getReportAfilProd(cedulas: AfilProdDTO[]): Observable<IReportAfilProd[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<IReportAfilProd[]>(this.url + 'getReportAfilProd', cedulas, {headers, params});
  }

  //get lista de afiliados que son delegados de un nucleo o todos los que son delegados 
  getAfiliadosDelegados(idNucleo: number): Observable<Afiliado[]> {
    let params = new HttpParams();
    params = params.append("idNucleo", idNucleo.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Afiliado[]>(this.url + 'getListAfilDelegados', {headers, params});
  }


}
