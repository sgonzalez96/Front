import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Ciudad } from '../models/ciudad';
import { Observable } from 'rxjs';
import { Deptos } from '../models/depto';
import { Localidad } from '../models/localidad';
import { Costo } from '../models/costo';

@Injectable({
  providedIn: 'root'
})
export class CiudadService  {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getCiudades(): Observable<Ciudad[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Ciudad[]>(this.url + 'getCiudades', {headers, params});
  }

  getDeptos(): Observable<Deptos[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Deptos[]>(this.url + 'getDeptos', {headers, params});
  }

  getLocalidades(): Observable<Localidad[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Localidad[]>(this.url + 'getLocalidades', {headers, params});
  }

  getCiuDep(depId: string): Observable<Ciudad[]> {
    let params = new HttpParams();
    params = params.append('depId', depId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Ciudad[]>(this.url + 'getCiuDep', {headers, params});
  }

  getLocCiud(ciudId: string): Observable<Localidad[]> {
    let params = new HttpParams();
    params = params.append('ciudId', ciudId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Localidad[]>(this.url + 'getLocCiud', {headers, params});
  }

  getCiudad(ciudId: string): Observable<Ciudad> {
    let params = new HttpParams();
    params = params.append('ciudId', ciudId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Ciudad>(this.url + 'getCiudad', {headers, params});
  }

  getDepto(depId: string): Observable<Deptos> {
    let params = new HttpParams();
    params = params.append('depId', depId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Deptos>(this.url + 'getDepto', {headers, params});
  }

  getLocalidad(locId: string): Observable<Localidad> {
    let params = new HttpParams();
    params = params.append('locId', locId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Localidad>(this.url + 'getLocalidad', {headers, params});
  }

  saveCiudad(ciudad: Ciudad) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setCiudad', ciudad, {headers});
  }

  saveLocalidad(localidad: Localidad) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setLocalidad', localidad, {headers});
  }

  deleteCiudad(idCiud: string){
    let params = new HttpParams();
    params = params.append('ciudId', idCiud);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteCiudad', null, {headers, params});

  }

  deleteLocalidad(idLoc: string){
    let params = new HttpParams();
    params = params.append('locId', idLoc);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteLocalidad', null, {headers, params});

  }

  //--------------------- Manejo de costos entre ciudades
  getCostos(idCiud: string): Observable<Costo[]> {
    let params = new HttpParams();
    params = params.append('ciudId', idCiud);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Costo[]>(this.url + 'getCostos', {headers, params});
  }

  saveCosto(costo: Costo) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setCosto', costo, {headers});
  }

}
