import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Evento } from '../models/evento';
import { Observable } from 'rxjs';
import { Invitacion } from '../models/invitacion';
import { InvResDTO } from '../models/invresdto';
import { InvDTO } from '../models/invdto';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getEventos(): Observable<Evento[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Evento[]>(this.url + 'getEventos', {headers, params});
  }

  getEventosFecTipo(fecini,fecfin,tipo): Observable<Evento[]> {
    let params = new HttpParams();
    params = params.append('fecini', fecini);
    params = params.append('fecfin', fecfin);
    params = params.append('tipo', tipo);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Evento[]>(this.url + 'getEventosFecTipo', {headers, params});
  }

  getEvento(eveId: string): Observable<Evento> {
    let params = new HttpParams();
    params = params.append('eveId', eveId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Evento>(this.url + 'getEvento', {headers, params});
  }

  saveEvento(evento: Evento) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setEvento', evento, {headers});
  }

  deleteEvento(idEvento: string){
    let params = new HttpParams();
    params = params.append('eveId', idEvento);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteEvento', null, {headers, params});
  }

  getInvitaciones(idEvento: string): Observable<Invitacion[]> {
    let params = new HttpParams();
    params = params.append('eveId', idEvento);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Invitacion[]>(this.url + 'getInvitaciones', {headers, params});
  }

  getInvUsu(cedula: string): Observable<Invitacion[]> {
    let params = new HttpParams();
    params = params.append('cedula', cedula);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Invitacion[]>(this.url + 'getInvUsu', {headers, params});
  }

  getInvitado(idEvento: string, cedula: string): Observable<Invitacion> {
    let params = new HttpParams();
    params = params.append('eveId', idEvento);
    params = params.append('cedula', cedula);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Invitacion>(this.url + 'getInvitado', {headers, params});
  }

  saveInvitacion(invitacion: InvDTO) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setInvitacion', invitacion, {headers});
  }

  saveInvLote(invitacion: InvDTO): Observable<boolean> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    console.log("mira que voy ");
    return this.http.post<boolean>(this.url + 'setInvLote', invitacion, {headers});
  }

  saveInvitaciones(invitaciones, mode,textolog,autorId): Observable<InvResDTO[]>{
    let params = new HttpParams();
    params = params.append('mode', mode);
    params = params.append('textolog', textolog);
    params = params.append('autorId', autorId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

    return this.http.post<InvResDTO[]>(this.url + 'setInvitaciones', invitaciones, {headers, params});
  }


}
