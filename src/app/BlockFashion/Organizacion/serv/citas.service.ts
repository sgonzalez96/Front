import { DTODownloadAdjunto } from './../models/adjuntos';
import { CitaEvento } from './../models/eventos';
import { Injectable } from '@angular/core';
import { EnvService } from '../../Tools/serv/env.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/citalegal';
import { citaDTO } from '../models/citadto';
import { DTOAdjunto, DTODescAdjunto, IAdjuntos } from '../models/adjuntos';
import { DTOHistoria } from '../models/DTOHistoria';
import { IMail } from '../models/mail';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getCitas(): Observable<Cita[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitas', { headers, params });
  }

  getCitasFecSol(fecini, fecfin): Observable<Cita[]> {
    let params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitasFecSol', { headers, params });
  }

  getCitasAfiFec(cedula, fecini, fecfin): Observable<Cita[]> {
    let params = new HttpParams();
    params = params.append('cedula', cedula);
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitasAfiFec', { headers, params });
  }

  getCitasNucFec(nucleo, fecini, fecfin): Observable<Cita[]> {
    let params = new HttpParams();
    params = params.append('nucleo', nucleo);
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    let headers = new HttpHeaders();
    console.log(params);
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitasNucFec', { headers, params });
  }

  getCitasAboFec(aboId: number, fecini, fecfin): Observable<Cita[]> {
    let params = new HttpParams();
    params = params.append('aboId', aboId.toString());
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitasAboFec', { headers, params });
  }

  getCitasAfi(cedula: string): Observable<Cita[]> {
    let params = new HttpParams();
    params = params.append('cedula', cedula);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita[]>(this.url + 'getCitasAfi', { headers, params });
  }


  getCita(citaId: string): Observable<Cita> {
    let params = new HttpParams();
    params = params.append('citaId', citaId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cita>(this.url + 'getCita', { headers, params });
  }

  //obtener descripcion por id de cita  
  getAdjuntosByCita(citaId: number): Observable<DTODescAdjunto[]> {
    let params = new HttpParams();
    params = params.append('citaId', citaId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<DTODescAdjunto[]>(this.url + 'getAdjuntosByCita', { headers, params });
  }

  //borrar descripcion y datos adjuntos
  deleteAdjuntoByDescr(item: IAdjuntos) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteAdjuntoByDescr', item, { headers });
  }

  //subir archivo directamente cuando ya hay una cita 
  saveCita(cita: citaDTO) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setCita', cita, { headers });
  }
  //salvar adjuntos cuando tengo citas creadas
  saveAdjuntosDirecto(adjuntos: DTOAdjunto) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'saveAdjuntosDirecto', adjuntos, { headers });
  }

  //disparar solo eventos de cita
  saveCitaEvento(event: CitaEvento) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'saveCitaEvento', event, { headers });
  }


  //consultar historial completo de la cita   getEventoByCita
  getEventoByCita(citaId: number): Observable<DTOHistoria[]> {
    let params = new HttpParams();
    params = params.append('citaId', citaId.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<DTOHistoria[]>(this.url + 'getEventoByCita', { headers, params });
  }

  //Descargar archivo adjunto 
  downloadAdjunto(idAdjunto: number): Observable<Blob>{
    let params = new HttpParams();
    params = params.append('idAdjunto', idAdjunto.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get(this.url + 'downloadAdjunto', { headers, params, responseType: 'blob' });
  }

    //envio de mail por solicatar materiales en la cita.
    sendMail(obj: IMail) {
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
      return this.http.post<any>(this.url + 'sendMail', obj, { headers });
    }

}
