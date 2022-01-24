import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { Operator } from '../../opus-users/models/operator';
import { LoginService } from '../../opus-users/services/login.service';
import { DepositoRoot } from '../models/deposito-root';
import { Device } from '../models/device';
import { LocaCheck } from '../models/loca-check';
import { PuntoPicking } from '../models/punto-picking';
import { Respuesta } from '../models/respuesta';
import { StorageCds } from '../models/storage-cds';
import { TipoCarga } from '../models/tipo-carga';
import { TipoEstanteria } from '../models/tipo-estanteria';


@Injectable({
  providedIn: 'root'
})
export class MatricerosService {

  url = '';

  constructor(private envsrv: EnvService, private http: HttpClient, private logser: LoginService) {
    this.url = envsrv.apiUrl;
  }

  // Devices

  getDevices(): Observable<Device[]> {

    let params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Device[]>(this.url + 'devices/getDevices', {headers, params});
  }

	getDevice(deviceId: string): Observable<Device> {
    let params = new HttpParams();
    params = params.append('deviceId', deviceId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Device>(this.url + 'devices/getDevice', {headers, params});
  }

	deleteDevice(deviceId: string): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('deviceId', deviceId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<boolean>(this.url + 'devices/deleteDevice', null, {headers, params});
  }

	setDevices(device: Device): Observable<Device> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Device>(this.url + 'devices/setDevices', device, {headers});
  }

  // Operators

  getOperators(): Observable<Operator[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Operator[]>(this.url + 'operators/getOperators', {headers});
  }

	getOperator(operatorId: number): Observable<Operator> {
    let params = new HttpParams();
    params = params.append('operatorId', operatorId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Operator>(this.url + 'operators/getOperator', {headers, params});
  }

	deleteOperator(operatorId: number): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('operatorId', operatorId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<boolean>(this.url + 'operators/deleteOperator', null, {headers, params});
  }

	setOperator(operator: Operator): Observable<Operator> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Operator>(this.url + 'operators/setOperator', operator, {headers});
  }

  changeOperatorState(operatorId: number, enabled: boolean): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('operatorId', operatorId.toString());
    params = params.append('enabled', enabled.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<boolean>(this.url + 'operators/setState', null, {headers, params});
  }

  // Storages

  getStorages(): Observable<StorageCds[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<StorageCds[]>(this.url + 'storages/getStorages', {headers});
  }

  getActiveStorages(): Observable<StorageCds[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<StorageCds[]>(this.url + 'storages/getActiveStorages', {headers});
  }

	getStorage(storageId: number): Observable<StorageCds> {
    let params = new HttpParams();
    params = params.append('storageId', storageId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<StorageCds>(this.url + 'storages/getStorage', {headers, params});
  }

	delStorage(storageId: number): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('storageId', storageId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<boolean>(this.url + 'storages/delStorage', null, {headers, params});
  }

	setStorage(storage: StorageCds): Observable<StorageCds> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<StorageCds>(this.url + 'storages/setStorage', storage, {headers});
  }

  changeStorageState(storageId: number, enabled: boolean): Observable<boolean>{
    let params = new HttpParams();
    params = params.append('storageId', storageId.toString());
    params = params.append('enabled', enabled.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<boolean>(this.url + 'storages/setState', null, {headers, params});
  }

  // Tipos de carga

  getTiposDeCarga(): Observable<Respuesta> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getLoadTypes', {headers});
  }

	getTipoDeCarga(tipoId: string): Observable<Respuesta> {
    let params = new HttpParams();
    params = params.append('id', tipoId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getLoadType', {headers, params});
  }

  delTipoCarga(tcId: string): Observable<Respuesta>{
    let params = new HttpParams();
    params = params.append('id', tcId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/deleteLoadTypes', null, {headers, params});
  }

	setTipoCarga(tcarga: TipoCarga): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/setLoadTypes', tcarga, {headers});
  }

  // Tipos de estanteria

  getTiposDeEstanteria(): Observable<Respuesta> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getRaks', {headers});
  }

	getTipoDeEstanteria(tipoId: string): Observable<Respuesta> {
    let params = new HttpParams();
    params = params.append('id', tipoId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getRak', {headers, params});
  }

  delTipoEstanteria(teId: string): Observable<Respuesta>{
    let params = new HttpParams();
    params = params.append('id', teId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/deleteRaks', null, {headers, params});
  }

	setTipoEstanteria(tipoEstanteria: TipoEstanteria): Observable<Respuesta> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/setRaks', tipoEstanteria, {headers});
  }

  // Puntos de picking

  getPuntosPicking(): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getPickingPoints', {headers});
  }

	getPuntoPicking(ppId: string): Observable<Respuesta> {
    let params = new HttpParams();
    params = params.append('id', ppId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getPickingPoint', {headers, params});
  }

  delPuntoPicking(ppId: string): Observable<Respuesta>{
    let params = new HttpParams();
    params = params.append('id', ppId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/deletePickingPoints', null, {headers, params});
  }

	setPuntoPicking(ppicking: PuntoPicking): Observable<Respuesta> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/setPickingPoints', ppicking, {headers});
  }

  // Planos

  getStorageInfo(depo: string, modo: string): Observable<Respuesta> {
    let params = new HttpParams();
    params = params.append('erpCode', depo);
    params = params.append('detail', modo);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getStorageInfo', {headers, params});
  }

  setPlano(diagram: DepositoRoot): Observable<Respuesta> {

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/setStorageDiagram', diagram, {headers});
  }

  deletePlano(erpCode: string, planoId: number): Observable<Respuesta> {
    let params = new HttpParams();
    params = params.append('erpCode', erpCode);
    params = params.append('planoId', planoId.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/deleteStorageDiagram', null, {headers, params});
  }

  // Puntos en plano

  asignoPuntoAPlano(diagram: DepositoRoot): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/assignPointsToDiagram', diagram, {headers});
  }

  eliminoPuntoDePlano(diagram: DepositoRoot): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/releasePointsFromDiagram', diagram, {headers});
  }

  // Locaciones

  asignoLocacionesAPunto(diagram: DepositoRoot): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/assignLocationsToPoint', diagram, {headers});
  }

  eliminoLocacionesAPunto(diagram: DepositoRoot): Observable<Respuesta> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.post<Respuesta>(this.url + 'logistic/releaseLocationsFromPoint', diagram, {headers});
  }

  getLocacionesPosibles(depId: string, onlyFree: boolean, rakType: string): Observable<LocaCheck[] | null> {
    let params = new HttpParams();
    params = params.append('depId', depId);
    params = params.append('onlyFree', onlyFree.toString());
    params = params.append('rakType', rakType);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.logser.getToken());

    return this.http.get<Respuesta>(this.url + 'logistic/getPossibleLocations', {headers, params}).pipe(
      map(
        resu => {
          if (resu.error) {
            return null;
          } else {
            let lasloca: LocaCheck[] = [];
            if (resu.object.locations != null && resu.object.locations.length > 0) {
              for (const ll of resu.object.locations) {
                const lch: LocaCheck = new LocaCheck();
                lch.checked = false;
                lch.locacion = ll;
                lasloca.push(lch);
              }
            }
            return lasloca;
          }
        }
      )
    );
  }

}
