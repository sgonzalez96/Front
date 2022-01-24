import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/env.service';
import { Attachment, AttachmentHead } from '../models/attachment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  url = '';

  constructor(private http: HttpClient,
    private envsrv: EnvService) {
    this.url = this.envsrv.apiUrl + 'general/';
  }

  //get list attachment
  getListAdjuntos(entidad: string, clave: string): Observable<AttachmentHead[]> {
    let params = new HttpParams();
    params = params.append("entidad", entidad);
    params = params.append("clave", clave);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<AttachmentHead[]>(this.url + 'getAdjuntos', { headers, params });
  }

  //get attachment by id 
  getAdjunto(id: number): Observable<AttachmentHead> {
    let params = new HttpParams();
    params = params.append("id", id);

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));

    return this.http.get<AttachmentHead>(this.url + 'getAdjuntoById', { headers, params });
  }

  //add 
  addAttachment(fileToUpload: File, data: AttachmentHead): Observable<AttachmentHead>{
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('head', new Blob([JSON.stringify({
      id: data.id,
      entidad: data.entidad ,
      clave: data.clave,
      fecha: data.fecha,
      usuario: data.usuario,
      descripcion: data.descripcion, 
      ubicacion: data.ubicacion,
      type: data.type}
    )],{
      type: "application/json"
  }));

   

    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.post<AttachmentHead> (this.url + 'addAdjunto3', formData, { headers, responseType: 'text' as 'json' });
}

  //download attachment
  download(id: number): Observable<Blob>{
    let params = new HttpParams();
    params = params.append('id', id.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.get(this.url + 'getAdjuntoArray', { headers, params, responseType: 'blob' });
  }

  //delete by id 
  //download attachment
  deleteAttach(id: number): Observable<AttachmentHead>{
    let params = new HttpParams();
    params = params.append('id', id.toString());
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer' + sessionStorage.getItem('token'));
    return this.http.post<AttachmentHead>(this.url + 'deleteAdjunto', null ,{ headers, params});
  }




}
