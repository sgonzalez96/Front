import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../../Tools/serv/env.service';
import { IProximoNucleo } from '../models/proximo-nucleo';

@Injectable({
  providedIn: 'root'
})
export class ProximoNucleoService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  // get all Proximo Nucleo
  findAllProximos(): Observable<IProximoNucleo[]> {
    const params = new HttpParams();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<IProximoNucleo[]>(this.url + 'findAllProxNuc', {headers, params});
  }

  // save item 
  saveProximo(data:IProximoNucleo):Observable<IProximoNucleo>{
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<IProximoNucleo>(this.url + 'saveProxNuc', data, {headers});
  }

  //refresh data table
  actualizo():Observable<void>{
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<void>(this.url + 'actualizando', null, {headers});
  }


}
