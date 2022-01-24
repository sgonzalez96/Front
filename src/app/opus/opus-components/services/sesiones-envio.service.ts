import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../opus-users/services/login.service';
import { EnvService } from 'src/app/env.service';
import { formatDate } from '@angular/common';
import { SesionEnvioHead } from '../models/sesion-envio-head';
import { SesionEnvio } from '../models/sesion-envio';


@Injectable({
  providedIn: 'root'
})
export class SesionesEnvioService {

  url = '';

  constructor(private envsrv: EnvService, private http: HttpClient, private logser: LoginService) {
    this.url = envsrv.apiUrl;
  }

  getSesionesEnvio(startDate: string, endDate: string, status: string, searchType: string, searchText: string,
    storageId: number): Observable<SesionEnvioHead[]> {

    let feci = formatDate(startDate, 'YYYY-MM-dd',"en-US");
    let fecf = formatDate(endDate, 'YYYY-MM-dd',"en-US");

    let params = new HttpParams();
    params = params.append('startDate', feci);
    params = params.append('endDate', fecf);
    params = params.append('searchType', searchType);
    params = params.append('searchText', searchText);
    params = params.append('status', status);
    params = params.append('storageId', storageId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<SesionEnvioHead[]>(this.url + 'senvCtrl/getEnvSessions', {headers, params});
  }

  findSesionById(id: number): Observable<SesionEnvio> {
    let params = new HttpParams();
    params = params.append('id', id.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<SesionEnvio>(this.url + 'senvCtrl/getSessionById', {
      headers,
      params,
    });
  }
}
