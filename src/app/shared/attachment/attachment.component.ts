import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { SuscriptionsClass } from 'src/app/core/models/suscriptions';
import { Usuario } from 'src/app/opus/opus-users/models/usuario';
import { LoginService } from 'src/app/opus/opus-users/services/login.service';
import Swal from 'sweetalert2';
import { AttachmentHead } from '../models/attachment';
import { AttachmentService } from '../services/attachment.service';
import { DownloadFileService } from '../services/download-file.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit,OnDestroy {

  $subs: SuscriptionsClass = new SuscriptionsClass(); // class to manage all subscriptions in my class
  @Input() entidad!: string;
  @Input() clave!: number;
  private usuario: Usuario = new Usuario;

  public attach: File | null = null;
  public attachHead: AttachmentHead = new AttachmentHead;
  public listAttached: AttachmentHead[] = [];



  constructor(
    private _attach: AttachmentService, 
    private _logsrv: LoginService,
    private _snotify : SnotifyService,
    private _download : DownloadFileService
    ) { }

  ngOnInit(): void {
    //get user
    this.usuario = this._logsrv.getUsuarioFromStorage();

    this.refreshData();
  }

  //get data ----------------------------------------------------------------------
  refreshData() {
    Swal.fire({
      titleText: "Cargando"
    });
    Swal.showLoading();
    //wait promise data
    this.getData().then(res => {
      Swal.close();
      if (res != null) {
        this.listAttached = res;
      }
    })
  }



  //get list file attach 
  getData(): Promise<AttachmentHead[] | null> {

    return new Promise((resolve, reject) => {
      if (this.entidad && this.clave) {
        this.$subs.setData(
          "listAttach",
          this._attach.getListAdjuntos(this.entidad, this.clave.toString()).subscribe(res => {
            if (res) {
              resolve(res);
            } else { reject(null) }
          })
        )
      } else {
        reject(null);
      }

    })
  }

  //actions --------------------------------------------------------------------------
  //event change 
  eventChange(event: any) {

    this.attach = event.files[0];
    this.attachHead.type = event.files[0].type;
    if (this.usuario) {
      this.attachHead.usuario = {
        idUser: this.usuario.idUser!,
        nombreCompleto: this.usuario.nombreCompleto!,
        userName: this.usuario.userName!
      };
    }
    this.attachHead.entidad = this.entidad;
    this.attachHead.clave = this.clave.toString();
    this.attachHead.fecha = new Date(Date.now());




  }


  // file attach
  FileAttach() {
    Swal.fire({
      title: 'Ingrese una descripcion para este archivo',
      input: 'text',
      inputAttributes: {
        min: "0",
        max:"50",
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (text) => {
        if (text === '' || text === 0) {
          Swal.showValidationMessage(
            'El campo no puede estar vacío'
          );
        }
        return text;
      },
    }).then((res) => {
      if (res.value) {
        this.attachHead.descripcion = res.value;
        this._attach.addAttachment(this.attach!,this.attachHead).subscribe(res=>{
          if (res) {
          this.refreshData();
            this._snotify.success(`El archivo fue guardado`,"Exito");
          } else {
            this._snotify.error("No se pudo completar la accion","Error");
          }
        });

      }

    });

  }

  //delete by id 
  deleteAttach(id: number) {
    Swal.fire({
      icon: "warning",
      text: "Estas seguro de querer eliminar el archivo",
      showCancelButton: true,
      cancelButtonText: "Cancelar",

    }).then(res => {
      if (res.value) {
        Swal.showLoading();
        this._attach.deleteAttach(id).subscribe(res => {
          if (res) {
            Swal.close();
            this.refreshData();
          }else{
            Swal.fire("Error","No se pudo eliminar el archivo","error")
          }
        },(err:HttpErrorResponse)=>{
          if (err.status != 500) {
            Swal.close();
          }else{
            Swal.fire("Error","No se pudo eliminar el archivo","error");
          }
          
        });
      }
    })
  }

  //download file
  download(id:number,type: string, name:string) {
    this._attach.download(id).subscribe(res=>{
      if (res) {
        this._download.downloadFile(type,name,res);
      }
    })
  }

  // detroy component -------------------------------------------------
  cleanData() {
    this.$subs.cleanAllSubs();
  }
  ngOnDestroy(): void {
    this.cleanData();
  }







}
