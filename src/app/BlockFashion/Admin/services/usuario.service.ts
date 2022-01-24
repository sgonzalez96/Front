import { Injectable, OnInit } from '@angular/core';
import { LoginService } from '../../Tools/serv/login.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvService } from '../../Tools/serv/env.service';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { Log } from '../models/log';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements OnInit {
  url = '';
  constructor(private logsrv: LoginService,
    private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl;
  }

  ngOnInit() {
  }

  getUsuario(usu: string): Observable<Usuario> {
    let params = new HttpParams();
    params = params.append('usu', usu);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get<Usuario>(this.url + 'getUsuario', {headers, params});
  }


  setUsuario (usu: Usuario) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'setUsuario', usu, {headers,params});
  }

  creoUsuario (usu: Usuario) {
    const elusu = this.logsrv.getUsuarioFromStorage();

    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'creoUsuario', usu, {headers, params});
  }

  getUsuarios(filtro: Boolean): Observable<Usuario[]> {
    this.logsrv.validateToken();

    const params = new HttpParams();

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario[]>(this.url + 'getUsuarios', {headers, params}).pipe(
      map(
        resu => {
          const hm = new Map();
          let lista: Usuario[] = [];
          if (!filtro) {
              for (let i = 0; i < resu.length; i++) {
                if (resu[i].enable) {
                  lista.push(resu[i]);
                }
              }
          } else {
              lista = resu ;
          }
          return lista;
        }
      )
    );
  }

  getUsuNivel(nivel: string): Observable<Usuario[]> {
    let params = new HttpParams();
    params = params.append('nivel', nivel);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Usuario[]>(this.url + 'getUsuariosByNivel', {headers, params});
  }

  cambioPass (usu: Usuario) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'cambioPass', usu, {headers,params});
  }

  usuBaja (usu: Usuario) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'bajaUsuario', usu, {headers,params});
  }

  usuReingreso (usu: Usuario) {
    const elusu = this.logsrv.getUsuarioFromStorage();
    let params = new HttpParams();
    params = params.append('usuId', elusu.idUser.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.post<any>(this.url + 'reingresoUsuario', usu, {headers,params});
  }

  getLogs(tipo: string, usuId: string): Observable<Log[]> {
    let params = new HttpParams();
    params = params.append('tipo', tipo);
    params = params.append('usuId', usuId);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<Log[]>(this.url + 'getLogUsu', {headers, params});
  }

    // alerta del delegado y el afiliado para comprobar padrones 
    checkStatusPadron(usu: Usuario,nivel:number): Observable<any> {
      let params = new HttpParams();
      params = params.append('nivel', nivel.toString());
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
  
      return this.http.post<any>(this.url + 'checkStatusPadron', usu ,{ headers,params });
    }
}
