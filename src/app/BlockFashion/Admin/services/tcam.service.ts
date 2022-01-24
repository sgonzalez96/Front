import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../Tools/serv/login.service';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { Tcam } from '../models/tcam';
import { ValMon } from '../models/valmon';

@Injectable({
  providedIn: 'root'
})
export class TcamService implements OnInit {

  url = '';
  constructor(private http: HttpClient,
              private loginsrv: LoginService,
              private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

ngOnInit() {
}

getTCByMon(monId): Observable<Tcam[]> {
this.loginsrv.validateToken();

let params = new HttpParams();
params = params.append('monId', monId);

let headers = new HttpHeaders();
headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
return this.http.get<Tcam[]>(this.url + 'getTCByMon', {headers, params});
}

getTCByMonFechas(monId, fecini, fecfin): Observable<Tcam[]> {
  this.loginsrv.validateToken();

  let params = new HttpParams();
  params = params.append('monId', monId);
  params = params.append('fecini', fecini);
  params = params.append('fecfin', fecfin);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
  return this.http.get<Tcam[]>(this.url + 'getTCByMonFechas', {headers, params});
  }


getTCByMonFec(monId, fecha): Observable<Tcam> {
  this.loginsrv.validateToken();

  let params = new HttpParams();
  params = params.append('monId', monId);
  params = params.append('fecha', fecha);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
  return this.http.get<Tcam>(this.url + 'getTCByMonFec', {headers, params});
}

getTCValMon(fecha): Observable<ValMon[]> {
  
  let params = new HttpParams();
  params = params.append('fecha', fecha);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
  return this.http.get<ValMon[]>(this.url + 'getTCValMon', {headers, params});
}

getTC(tcId): Observable<Tcam> {
  let params = new HttpParams();
  params = params.append('tcId', tcId);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
  return this.http.get<Tcam>(this.url + 'getTC', {headers, params});
}

saveTC(tc: Tcam) {
let headers = new HttpHeaders();
headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
return this.http.post<any>(this.url + 'setTC', tc, {headers});
}

// setMonTC(monId, fecini: string, fecfin: string): Observable<any> {
//   this.loginsrv.validateToken();
//   let params = new HttpParams();
//   params = params.append('monId', monId);
//   params = params.append('fecini', fecini);
//   params = params.append('fecfin', fecfin);

//   let headers = new HttpHeaders();
//   headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
//   console.log('vamoooos ');
//   console.log(params);
//   return this.http.post<any>(this.url + 'setMonTC', null, {headers, params});
// }


deleteTC(tcId) {
  let params = new HttpParams();
  params = params.append('tcId', tcId);

  let headers = new HttpHeaders();
  headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
  return this.http.post<any>(this.url + 'delTC', null, {headers, params});
  }


}
