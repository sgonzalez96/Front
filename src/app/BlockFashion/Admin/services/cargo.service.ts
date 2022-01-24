import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Cargo } from '../models/cargo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  url = '';

  constructor(
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  getCcargos(subg: string): Observable<Cargo[]> {
    let params = new HttpParams();
    params = params.append('subgrupo', subg);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cargo[]>(this.url + 'getCargos', {headers, params});
  }

  getCargo(carId: string): Observable<Cargo> {
    let params = new HttpParams();
    params = params.append('carId', carId);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Cargo>(this.url + 'getCargo', {headers, params});
  }

  saveCargo(cargo: Cargo) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setCargo', cargo, {headers});
  }

  deleteCargo(idCargo: string){
    let params = new HttpParams();
    params = params.append('carId', idCargo);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'deleteCargo', null, {headers, params});

  }

}
