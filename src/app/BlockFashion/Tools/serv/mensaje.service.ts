import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EnvService } from './env.service';
import { Observable } from 'rxjs';
import { Mensaje } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  url = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getMensajes(modos: string[]): Observable<Mensaje[]> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    console.log("voy por mensajes");
    return this.http.post<Mensaje[]>(this.url + 'getMensajes', modos,  {headers});
  }
}
