import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public apiUrl = environment.apiUrl;
  public apiAuth = environment.apiAuth;
  public urlSolicitud = environment.urlSolicitud;
  constructor() { }
}
