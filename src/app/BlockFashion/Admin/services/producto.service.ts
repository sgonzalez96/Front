import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoService implements OnInit {

  url = '';

  constructor(private http: HttpClient,
              private envsrv: EnvService) { 
    this.url = this.envsrv.apiUrl;
  }

  ngOnInit() {
  }

  getListProduct(): Observable<Producto[]> {
    const params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Producto[]>(this.url + 'findAllProductos', {headers, params});
  }

  // getRol(rolId: string): Observable<Rol> {
  //   let params = new HttpParams();
  //   params = params.append('rolId', rolId);

  //   let headers = new HttpHeaders();
  //   headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

  //   return this.http.get<Rol>(this.url + 'getRol', {headers, params});
  // }

  saveProduct(product: Producto): Observable<Producto> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<Producto>(this.url + 'saveProducto', product, {headers});
  }

  deleteProduct(id: number){
    let params = new HttpParams();
    params = params.append('id', id.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get<any>(this.url + 'deleteProducto', {headers, params});

  }
}
