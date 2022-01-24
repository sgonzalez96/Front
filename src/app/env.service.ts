import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // public apiUrl = 'https://192.168.1.33:8443/ComasaWeb-1/comasa/api/';
  // public apiAuth = 'https://192.168.1.33:8443/ComasaWeb-1/oauth/token';

  public apiUrl = environment.apiUrl;
  public apiAuth = environment.apiAuth;

  //public apiUrl = 'https://opus-web.erro.com.uy:8444/OpusWebErroBack-0.0.1/opuserro/api/';
 //public apiAuth = 'https://opus-web.erro.com.uy:8444/OpusWebErroBack-0.0.1/oauth/token';


  constructor() { }
}
