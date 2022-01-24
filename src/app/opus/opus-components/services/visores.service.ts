import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { LoginService } from '../../opus-users/services/login.service';
import { SeparationHeader } from '../models/separation-header';
import { Separation } from '../models/separation';
import { PedidoHeader } from '../models/pedido-header';
import { Pedido } from '../models/pedido';
import { SeparationOrder } from '../models/separation-order';
import { OrderAndSepa } from '../models/order-and-sepa';


@Injectable({
  providedIn: 'root'
})
export class VisoresService {

  url = '';

  constructor(private envsrv: EnvService, private http: HttpClient, private logser: LoginService) {
    this.url = envsrv.apiUrl;
  }

  findSeparationByStateDates(estado: string, feci: string, fecf: string): Observable<SeparationHeader[]> {
    let params = new HttpParams();
    params = params.append('state', estado);
    params = params.append('startDate', feci);
    params = params.append('endDate', fecf);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<SeparationHeader[]>(this.url + 'separations/findSeparationByStateDates', {headers, params});
  }

  findSeparationById(separationId: number): Observable<Separation> {
    let params = new HttpParams();
    params = params.append('separationId', separationId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Separation>(this.url + 'separations/findSeparationById', {headers, params});
  }

  findActiveOrders(estado: string, feci: string, fecf: string): Observable<PedidoHeader[]> {
    let params = new HttpParams();
    params = params.append('state', estado);
    params = params.append('startDate', feci);
    params = params.append('endDate', fecf);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<PedidoHeader[]>(this.url + 'orders/findActiveOrders', {headers, params});
  }

  findOrderbyId(orderId: number): Observable<Pedido> {
    let params = new HttpParams();
    params = params.append('orderId', orderId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Pedido>(this.url + 'orders/findOrderById', {headers, params});
  }

  findFullSeparationById(separationId: number): Observable<SeparationOrder> {
    let params = new HttpParams();
    params = params.append('separationId', separationId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<SeparationOrder>(this.url + 'separations/findFullSepById', {headers, params});
  }

  trackOrderByERPId(erpId: string): Observable<OrderAndSepa> {
    let params = new HttpParams();
    params = params.append('erpId', erpId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<OrderAndSepa>(this.url + 'orders/trackOrderByERPId', {headers, params});
  }
}
