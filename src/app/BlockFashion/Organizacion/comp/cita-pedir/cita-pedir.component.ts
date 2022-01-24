import { AbogadosService } from './../../serv/abogados.service';
import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Admin/models/usuario';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { Cita } from '../../models/citalegal';
import { formatDate } from '@angular/common';
import { LoginService } from '../../../Tools/serv/login.service';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { CitasService } from '../../serv/citas.service';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';
import Swal from 'sweetalert2';
import { citaDTO } from '../../models/citadto';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { AfilNucleo } from '../../../Afiliados/models/afilnuc';
import { DTOAdjunto, DTODescAdjunto, IAdjuntos } from '../../models/adjuntos';
import { CitaEvento } from '../../models/eventos';
import { DownloadFileService } from '../../serv/download-file.service';
import { Abogado } from '../../models/abogado';

@Component({
  selector: 'app-cita-pedir',
  templateUrl: './cita-pedir.component.html',
  styleUrls: ['./cita-pedir.component.css']
})
export class CitaPedirComponent implements OnInit {
  activos = true;
  lista: listaDTO[];
  elusu: Usuario;
  hoy: string;
  objAfil: Afiliado;
  objDato: Dato;
  motivo = '';
  prefiere = '';
  objCitaDTO: citaDTO = new citaDTO();
  objNucleo: Nucleo = new Nucleo();
  listaNuc: AfilNucleo[];
  files: IAdjuntos[] = [];   //list to front 
  cacheFile = [];//list cache from reader Filer
  adjuntosDirecto: DTOAdjunto = new DTOAdjunto; //  grabar adjuntos directamente cuando hay una cita creada 
  listAbogados: Abogado[]= [];
  preferAbogado: string="Sin preferencia";
  public isSubmit: boolean = false;

  constructor(
    private logsrv: LoginService,
    private afisrv: AfiliadosService,
    private datsrv: DatosService,
    private citasrv: CitasService,
    private dwServ: DownloadFileService,
    private abosrv: AbogadosService
  ) {

  }

  ngOnInit() {
    this.cacheFile = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.hoy = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    this.lista = [];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.afisrv.getAfiliado(this.elusu.afinro.toString().trim()).subscribe(
      elafi => {
        this.afisrv.getNucAfiliado(elafi.cedula.trim()).subscribe(
          lisnuc => {
            if (lisnuc == null || lisnuc === undefined) {
              Swal.fire({
                title: 'Consulte en SINTEP el estado de su ficha. No hay nucleos asociacdos ',
                text: '',
                type: 'warning',
                confirmButtonText: 'OK',
              });
            }
            this.listaNuc = lisnuc;
            this.objNucleo = this.listaNuc[0].nucleo;
            for (const nunu of this.listaNuc) {
              if (nunu.cotizante) {
                this.objNucleo = nunu.nucleo;
                break;
              }
            }

          }
        );

        this.objAfil = elafi;
        this.cargo();
      }, error => {
        console.log(error);
      }
    );
    //buscar abogado
    this.listAbogados=[];
    this.abosrv.getAbogados().subscribe(
      res => {
        res.forEach(element => {
          if (element.activo && element.horario != null && element.dias != null) {
            this.listAbogados.push(element)
          }
        });
        
      }
    );

  }

  //select abogado 
  abogadoSelec(index: number){
    console.log(index);
    if (index == null) {
      this.objCitaDTO.cita.abogPrefiere = "Sin preferencia";
    }else{
      for (let i = 0; i < this.listAbogados.length; i++) {
        if (i = index) {
          this.objCitaDTO.cita.abogPrefiere = this.listAbogados[i].nombre;
        }
        
      }
    }
  }

  //file  cuando elijo archivos en el input
  async processFile(event: any) {
    let result;
    Swal.showLoading();

    // recorro para construir los array de byte
    this.adjuntosDirecto.adjuntos = [];
    this.adjuntosDirecto.head = [];
    this.adjuntosDirecto.evento = new CitaEvento;
    for (let i = 0; i < event.target.files.length; i++) {
      try {
        result = await this.loadDataFile(event.target.files[i]);
        this.cacheFile.push(result);
      } catch (error) {
        console.warn(error.message);
      } finally {

        //si cambio de vista voy directo al servicio para grabar los adjuntos
        //lo hago asi pq en un caso tengo el id de cita para asociar pero en otro no 
        //y tengo que enviarle el id de la cita asociada
        if (this.lista.length > 0) {

          //armo la info
          Swal.showLoading();
          this.adjuntosDirecto.idCita = this.lista[0].cita.id;
          this.adjuntosDirecto.adjuntos.push(result);
          this.adjuntosDirecto.head.push({
            name: event.target.files[i].name,
            size: event.target.files[i].size,
            fecha: new Date(Date.now()),
            type: event.target.files[i].type,
          });
        }else{
          this.files.push({
            name: event.target.files[i].name,
            size: event.target.files[i].size,
            fecha: new Date(Date.now()),
            type: event.target.files[i].type,
          })
        }

      }

    }

    //grabar adjunto
    if (this.lista.length > 0) {
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
        Swal.fire("Error", "No se pudo grabar los archivos", "error")
      })
    }

    Swal.close();
  }
  //convert array de file en cadena de string con el nombre del arch
  arrayToString(arr: Array<any>): string {
    let temp = []
    for (let i = 0; i < arr.length; i++) {
      temp.push(arr[i].name)
    }

    return temp.toString();
  }

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

  //load data file fron event change
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
    this.citasrv.downloadAdjunto(data.fkadjunto).subscribe((res) => {
      if (res) {
        this.dwServ.manageExcelFile(data.type, data.name, res);
        //creo el evento que le corresponde
        let evento = new CitaEvento;
        evento.tipo = "Descarga de Adjunto";
        evento.usuario = this.elusu.idUser;
        evento.fkcita = this.lista[0].cita.id;
        evento.adjuntos = data.name;
        evento.fecha = new Date(Date.now());

        const temp = this.citasrv.saveCitaEvento(evento).subscribe();
      }
    })
  }

  cargo() {
    this.lista = [];
    this.citasrv.getCitasAfi(this.objAfil.cedula.trim()).subscribe(
      recita => {
        console.log(recita);

        for (const cita of recita) {
          let estava = false;
          if (this.activos) {
            if (cita.status === 'Solicitada' || cita.status === 'Agendada') {
              estava = true;
            }
          } else {
            estava = true;
            if (cita.status === 'Solicitada' || cita.status === 'Agendada') {
              estava = false;
            }
          }
          if (estava) {
            let unacita: listaDTO = new listaDTO();
            unacita.cita = cita;
            this.lista.push(unacita);
          }
        }
        if (this.lista.length != 0) {
          this.getadjuntoByCita(this.lista[0].cita.id);
        }


      }

    );
  }
  //obtener lista de adjuntos por id de cita
  getadjuntoByCita(citaId: number) {
    this.citasrv.getAdjuntosByCita(citaId).subscribe((res) => {
      if (res) {
        this.files = res;
      }
    });
  }

  switch() {
    if (this.activos) {
      this.activos = false;
    } else {
      this.activos = true;
    }
    this.cargo();
  }

  solicito() {
    if (this.objNucleo == null) {
      Swal.fire({
        title: 'No hay nucleo asociado al afiliado',
        text: '',
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (this.motivo.trim() === '' || this.prefiere.trim() === '') {
      Swal.fire({
        title: 'Debe ingresar motivo y preferencia',
        text: '',
        type: 'warning',
        confirmButtonText: 'OK',
      });
    } else {
      this.objCitaDTO.textolog = 'Solicitud de consulta legal';
      this.objCitaDTO.usuId = this.elusu.idUser;
      this.objCitaDTO.cita.abogPrefiere = this.preferAbogado;
      this.objCitaDTO.cita.motivo = this.motivo;
      this.objCitaDTO.cita.prefiere = this.prefiere;
      this.objCitaDTO.cita.afiliado = this.objAfil;
      this.objCitaDTO.cita.nucleo = this.objNucleo;
      this.objCitaDTO.cita.fecsol = new Date();
      this.objCitaDTO.cita.status = 'Solicitada';
      this.objCitaDTO.cita.asistio = false;
      this.objCitaDTO.descAdjuntos = this.files;
      this.objCitaDTO.adjuntos = this.cacheFile;
      this.objCitaDTO.vamail = false;
      console.log(this.objCitaDTO);
      Swal.showLoading();
      this.isSubmit = true;
      this.citasrv.saveCita(this.objCitaDTO).subscribe(
        resok => {
          this.isSubmit = false;
          Swal.fire({
            title: 'Consulta ingresada número ' + resok.id,
            text: '',
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.ngOnInit();
        },()=>{
          Swal.fire()
        }

      );
    }

  }
}

export class listaDTO {
  cita: Cita;

  // adv_exc = false;
  // adv_nov = false;
  // adv_sta = false;
  // adv_han = false; 
  // adv_pow = false;

  // btn_pen = false;
  // btn_thu = false;
  // btn_han = false;
  // btn_tha = false;
  // btn_pow = false;
  // btn_sta = false;


}
