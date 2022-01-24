import { IMail } from './../../models/mail';
import { CitaEvento } from './../../models/eventos';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CitasService } from '../../serv/citas.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { Cita } from '../../models/citalegal';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { citaDTO } from '../../models/citadto';
import { AfilNucleo } from '../../../Afiliados/models/afilnuc';
import { Usuario } from '../../../Admin/models/usuario';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { Abogado } from '../../models/abogado';
import { AbogadosService } from '../../serv/abogados.service';
import { DTOAdjunto, DTODescAdjunto, IAdjuntos } from '../../models/adjuntos';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DTOHistoria } from '../../models/DTOHistoria';
import { DownloadFileService } from '../../serv/download-file.service';
import { title } from 'process';

@Component({
  selector: 'app-cita-editar',
  templateUrl: './cita-editar.component.html',
  styleUrls: ['./cita-editar.component.css']
})
export class CitaEditarComponent implements OnInit {
  idAfil = '';
  objAfil = new Afiliado();
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  abogados: Abogado[]=[];

  objCita = new Cita();
  objNucleo: Nucleo = new Nucleo();
  listaNuc: AfilNucleo[];
  objCitaDTO = new citaDTO();
  elusu: Usuario;
  historial: DTOHistoria[]=[];
  inputChanged : Array<string> = []; // check if there were change in input

  quemodocita = '';

  //adjuntar---------------
  public para: string = "";
  files: IAdjuntos[] = [];   //list to front 
  cacheFile = [];//list cache from reader Filer
  adjuntosDirecto: DTOAdjunto = new DTOAdjunto;

  constructor(
    private abosrv: AbogadosService,
    private _location: Location,
    private logsrv: LoginService,
    private citasrv: CitasService,
    private ususrv: UsuarioService,
    private actRout: ActivatedRoute,
    private modalService: NgbModal,
    private dwServ: DownloadFileService
  ) { }

  ngOnInit() {
    this.abogados = [];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.actRout.paramMap.subscribe(
      params => {
        let idCita = params.get('id');
        this.quemodocita = params.get('modo');
        this.citasrv.getCita(idCita).subscribe(
          recita => {
            console.log(recita);
            this.objCita = recita;
            this.objAfil = recita.afiliado;
            this.objNucleo = recita.nucleo;
            if (this.quemodocita === 'A') {
              this.abosrv.getAbogados().subscribe(
                resab => {
                  resab.forEach(element => {
                    if (element.activo) {
                      this.abogados.push(element);
                    }
                  });
 
                  this.objCita.abogado = this.abogados[0];
                }
              );
            }

            //obtengo adjuntos si tiene 
            this.citasrv.getAdjuntosByCita(recita.id).subscribe((res) => {
              if (res) {
                this.files = res;
              }
            });

          }, error => {
            console.log(error);
          }
        );

        this.consultarHistorial(parseInt(idCita));

      }
    );
  }

  //consultar historial de la cita 
  consultarHistorial(idCita:number){
    this.citasrv.getEventoByCita(idCita).subscribe((res)=> {
      if (res) {
        this.historial= res;
      }
    })
  }

  // modulo para manejar archivos ---------------------------------------------------------------------
  //delete
  deleteFile(index: number) {
    let temp = [];
    let cacheTemp = [];
    for (let i = 0; i < this.files.length; i++) {
      if (i != index) {
        temp.push(this.files[i]);
      }
    }
    for (let i = 0; i < this.cacheFile.length; i++) {
      if (i != index) {
        cacheTemp.push(this.cacheFile[i]);
      }

    }


    this.files = temp;
    this.cacheFile = cacheTemp;

  }

  //file  cuando elijo archivos desde el evento change en el input
  async processFile(event: any) {
    let result;
    Swal.showLoading();
    // preparo el dto vacio 
    this.adjuntosDirecto.adjuntos = [];
    this.adjuntosDirecto.head = [];
    this.adjuntosDirecto.evento = new CitaEvento;
    // recorro para construir los array de byte
    for (let i = 0; i < event.target.files.length; i++) {
      try {
        result = await this.loadDataFile(event.target.files[i]);
        this.cacheFile.push(result);
      } catch (error) {
        console.warn(error.message);
      } finally {
        //cargo el dto
        Swal.showLoading();
        this.adjuntosDirecto.idCita = this.objCita.id;
        this.adjuntosDirecto.adjuntos.push(result);
        this.adjuntosDirecto.head.push({
          name: event.target.files[i].name,
          size: event.target.files[i].size,
          fecha: new Date(Date.now()),
          type: event.target.files[i].type,
        });


      }

    }

    // grabo historial
    this.adjuntosDirecto.evento.fecha = new Date(Date.now());
    this.adjuntosDirecto.evento.fkcita = this.adjuntosDirecto.idCita;
    this.adjuntosDirecto.evento.usuario = this.elusu.idUser;
    this.adjuntosDirecto.evento.tipo = "Adjuntar Archivo";
    this.adjuntosDirecto.evento.adjuntos = this.arrayToString(event.target.files);
    this.citasrv.saveAdjuntosDirecto(this.adjuntosDirecto).subscribe((res) => {
      if (res == null) {
        this.getadjuntoByCita(this.adjuntosDirecto.idCita);
        Swal.close();
      }
    }, err => {
      Swal.fire("Error", "No se pudieron cargar los archivos", "error")
    })
  }

  //obtener lista de adjuntos por id de cita
  getadjuntoByCita(citaId: number) {
    this.citasrv.getAdjuntosByCita(citaId).subscribe((res) => {
      if (res) {
        this.files = res;
      }
    });
  }

  //convert array de file en cadena de string con el nombre del arch
  arrayToString(arr: Array<any>): string {
    let temp = []
    for (let i = 0; i < arr.length; i++) {
      temp.push(arr[i].name)
    }

    return temp.toString();
  }

  //load data file , convert to byte array
  loadDataFile(file) {

    let reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };

      reader.readAsArrayBuffer(file);

      reader.onload = (evt) => {
        let fileByteArray = [];
        let arrayBuffer = <ArrayBuffer>reader.result;
        let array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
          fileByteArray.push(array[i]);
        }
        resolve(fileByteArray);
      }
    });

  }

  //delete descripcion y adjunto 
  deleteAdjunto(item: IAdjuntos, index) {
    Swal.fire({
      title: 'Esta acción elimina el archivo adjunto?',
      showCancelButton: true,
      confirmButtonText: `Borrar`,
    }).then((result) => {
      if (result) {
        this.citasrv.deleteAdjuntoByDescr(item).subscribe((res) => {
          if (res) {
            //lo borro tamb de la lisa file y cachefile
            this.deleteFile(index);
          }
        })
      }
    })

  }


  //download file
  download(data: DTODescAdjunto) {
    this.citasrv.downloadAdjunto(data.fkadjunto).subscribe((res)=>{
      if (res) {
        this.dwServ.manageExcelFile(data.type,data.name,res);
        //creo el evento que le corresponde
        let evento = new CitaEvento;
        evento.tipo= "Descarga de Adjunto";
        evento.usuario = this.elusu.idUser;
        evento.fkcita = this.objCita.id;
        evento.adjuntos = data.name;
        evento.fecha = new Date(Date.now());

      //  const temp =  this.citasrv.saveCitaEvento(evento).subscribe();
      }
    })
  }


  //modal para construir el mail de solicitud de materiales
  openMailCompose(content) {
    this.para = this.objCita.nucleo.email;
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      console.log(result);
    }, (reason:IMail) => {
      console.log(reason);
      // se envio el mail
      if (reason != null) {
        //armo el evento 
        let evento = new CitaEvento;
        evento.fkcita = this.objCita.id;
        evento.fecha = new Date(Date.now());
        evento.tipo = "Solicitar Materiales";
        evento.usuario = this.elusu.idUser;
        evento.texto = "Se envió un mail a " + reason.destino;

        //send mail 
        this.citasrv.sendMail(reason).subscribe();

        //grabar el evento 
        this.citasrv.saveCitaEvento(evento).subscribe(()=>{
          this.consultarHistorial(this.objCita.id);
        });
      }
      this.getDismissReason(reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onChangeAbo(elabo) {
    for (const abogado of this.abogados) {
      if (elabo.trim() === abogado.nombre.trim()) {
        this.objCita.abogado = abogado;
        break;
      }
    }
  }
  //check change of date and result 
  checkCambio(change:string){
    let arr2 ="";
    arr2 = this.inputChanged.find(res=> res == change);
    if (!arr2) {
      this.inputChanged.push(change);
    }
    console.log(this.inputChanged);
  }

  creoCita(f: NgForm) {
    Swal.fire({text: "Guardando datos"});
    Swal.showLoading();
    if (this.quemodocita === 'A') {
      this.objCitaDTO.textolog = 'Agendada';
      this.objCita.status = 'Agendada'; 
    }
    if (this.quemodocita === 'C') {
      this.objCitaDTO.textolog = 'Cumplida';
      this.objCita.status = 'Cumplida';
    }
    this.objCitaDTO.usuId = this.elusu.idUser;

    this.objCitaDTO.cita = this.objCita;
    if (this.inputChanged.length != 0) {
      Swal.fire({
        titleText:"Desea enviar mail",
        text:"Hubo cambios en el campo:"+ (this.inputChanged[0] || " ") + " " +(this.inputChanged[1] || " ")+ " " +(this.inputChanged[2] || " "),
        showCancelButton: true,
        cancelButtonText:"NO"
      }).then((res)=>{
        if (res.value) {
          this.objCitaDTO.vamail = true;
        }else{
          this.objCitaDTO.vamail = false;
        }
        Swal.fire({text: "Guardando datos"});
        Swal.showLoading();
        this.citasrv.saveCita(this.objCitaDTO).subscribe(
          resok => {
            Swal.close();
            // creo evento
            const evento = new CitaEvento;
            evento.tipo = this.objCita.status;
            evento.fecha = new Date(Date.now());
            evento.fkcita = this.objCita.id;
            evento.texto = "La consulta fue actualizada al estado " + this.objCita.status;
            evento.usuario = this.elusu.idUser;
            
            //envio evento
            const temp =  this.citasrv.saveCitaEvento(evento).subscribe();
            Swal.fire({
              title: 'Consulta legal actualizada',
              text: '',
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.volver();
          }
        );
      })
    }else{
      Swal.fire({text: "Guardando datos"});
      Swal.showLoading();
    this.citasrv.saveCita(this.objCitaDTO).subscribe(
      resok => {
        Swal.close();
        // creo evento
        const evento = new CitaEvento;
        evento.tipo = this.objCita.status;
        evento.fecha = new Date(Date.now());
        evento.fkcita = this.objCita.id;
        evento.texto = "La consulta fue actualizada al estado " + this.objCita.status;
        evento.usuario = this.elusu.idUser;
        
        //envio evento
        const temp =  this.citasrv.saveCitaEvento(evento).subscribe();
        Swal.fire({
          title: 'Consulta legal actualizada',
          text: '',
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
      }
    ); 
    }
    
  }

  volver() {
    this._location.back();
  }


}
