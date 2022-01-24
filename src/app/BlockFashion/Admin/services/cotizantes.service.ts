import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AfilNucleo } from '../../Afiliados/models/afilnuc';
import { EnvService } from '../../Tools/serv/env.service';
import { LoginService } from '../../Tools/serv/login.service';
import { ICotizantes } from '../models/cotizantes';

@Injectable({
  providedIn: 'root'
})
export class CotizantesService {

  url = '';

  constructor(
      private loginsrv: LoginService,
      private envsrv: EnvService,
      private http: HttpClient ) {
      this.url = this.envsrv.apiUrl;
   }

  //get cotizantes
  getCotizantes(sub:number,dep:number): Observable<ICotizantes[]> {
    
    let params = new HttpParams();
    params = params.append('subgrupo', sub.toString());
    params = params.append('depfk', dep.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<ICotizantes[]>(this.url + 'getInfoNucleos', {headers, params});
  }
  //filter
  getAfiNucleo(nuc:number): Observable<AfilNucleo[]> {
    
    let params = new HttpParams();
    params = params.append('nucId', nuc.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<AfilNucleo[]>(this.url + 'getAfiNucleo', {headers, params});
  }

}
