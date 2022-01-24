import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Nucleo } from '../models/nucleo';
import { Observable } from 'rxjs';
import { LoginService } from '../../Tools/serv/login.service';
import { Nucleopaddto } from '../models/nucleopaddto';
import { InfoMensualDTO } from '../models/infoMensual';

@Injectable({
  providedIn: 'root'
})
export class NucleosService {

  url = '';

  constructor(
    private logsrv: LoginService,
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getNucleos(): Observable<Nucleo[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Nucleo[]>(this.url + 'getNucleos', {headers, params});
  }

  getNucleosStatus(padron: string): Observable<Nucleo[]> {
    let params = new HttpParams();
    params = params.append("padron",padron);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Nucleo[]>(this.url + 'getNucleosStatus', {headers, params});
  }

  getNucleosPadron(filtro: string): Observable<Nucleopaddto[]> {
    let params = new HttpParams();
    params = params.append('filtro', filtro);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Nucleopaddto[]>(this.url + 'getNucleosPadron', {headers, params});
  }

  //obtener informe mensual por nucleos y mes/año
  getInfoMensualNucleos(fecha:string): Observable<InfoMensualDTO[]> {
    let params = new HttpParams();
    params = params.append('fecha', fecha);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<InfoMensualDTO[]>(this.url + 'getInfoMensualNucleos', {headers, params});
  }



  getNucleosActivos(): Observable<Nucleo[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Nucleo[]>(this.url + 'getNucleosActivos', {headers, params});
  }


  getNucleo(nucId: string): Observable<Nucleo> {
    let params = new HttpParams();
    params = params.append('nucId', nucId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Nucleo>(this.url + 'getNucleo', {headers, params});
  }

  saveNucleo(nucleo: Nucleo) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setNucleo', nucleo, {headers, params});
  }
  //check nucleo padron
  checkNucleoPadron(nucleo: Nucleo) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'checkNucleoPadron', nucleo, {headers, params});
  }

  deleteNucleo(idNucleo: string){
    let params = new HttpParams();
    params = params.append('nucId', idNucleo);

    const elusu = this.logsrv.getUsuarioFromStorage();
    params = params.append('usuId', elusu.idUser.toString());


    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteNucleo', null, {headers, params});

  }

  //proximo nucleo 
  proxNucleo(sub:number,reg:string): Observable<number>{
    let params = new HttpParams();
    params = params.append('sub', sub.toString());
    params = params.append('reg', reg);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<number>(this.url + 'getProximo', {headers, params});
  }

}
