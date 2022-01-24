import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { EnvService } from '../../../env.service';
import { Dtomenu } from '../models/DtoMenu';
import { Dtoitem } from '../models/DtoItem';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnInit {
  url = '';

  constructor(
      private router: Router,
      private envsrv: EnvService,
      private http: HttpClient ) {
      this.url = this.envsrv.apiUrl;
   }

  ngOnInit(){

  }

  getMenuUsu(usuId: number): Observable<Dtomenu[]> {

    let params = new HttpParams();
    params = params.append('usuId', usuId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Dtomenu[]>(this.url + 'menu/getMenuUsu', {headers, params});
  }

  getMenuTotal(rolId: number, usuId: number): Observable<Dtomenu[]> {

    let params = new HttpParams();
    params = params.append('rolId', rolId.toString());
    params = params.append('usuId', usuId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Dtomenu[]>(this.url + 'menu/getMenuTotal', {headers, params});
  }

  getPermiso(usuId: number, itemId: string): Observable<Dtoitem> {

    let params = new HttpParams();
    params = params.append('funcionId', itemId);
    params = params.append('usuId', usuId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Dtoitem>(this.url + 'menu/getPermiso', {headers, params});
  }

  savePermiso(item: Dtoitem): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    if (item.fkusu !== 0) {
      return this.http.post<any>(this.url + 'menu/setPermisoUsu', item, {headers});
    } else {
      return this.http.post<any>(this.url + 'menu/setPermisoRol', item, {headers});
    }
  }

  // set or clean access from item group 
  AccessGroupItems(items: Dtoitem[], flag: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    let params = new HttpParams();
    params = params.append('flag', flag);
    return this.http.post<any>(this.url + 'menu/setAccessAllItem', items, {headers,params});
  
  
    }

  deletePermiso(item: Dtoitem) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    let params = new HttpParams();
    if (item.fkusu !== 0) {
      if (item.id !== undefined) {
        params = params.append('prmusuId', item.id.toString());
      }
      return this.http.post<any>(this.url + 'menu/deletePermisoUsu', item, {headers, params});
    } else {
      if (item.id) {
        params = params.append('prmrolId', item.id.toString());
      }
      return this.http.post<any>(this.url + 'menu/deletePermisoRol', item, {headers, params});
    }
  }

  //check if current user have access to current path
  checkAccessURL(objPermiso: Dtoitem): void{
    if (!objPermiso.accede) {
      this.router.navigateByUrl('/home');
    }
  }
}
