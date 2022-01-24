import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Cita } from '../../models/citalegal';
import { citaDTO } from '../../models/citadto';
import { Usuario } from '../../../Admin/models/usuario';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { CitasService } from '../../serv/citas.service';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';

@Component({
  selector: 'app-cita-vernuc',
  templateUrl: './cita-vernuc.component.html',
  styleUrls: ['./cita-vernuc.component.css']
})
export class CitaVernucComponent implements OnInit {
  pageSettings = pageSettings;
  lista: Cita[]=[];
  objCita = new Cita();
  objCitaDTO = new citaDTO();

  elusu: Usuario;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  afecini = '';
  afecfin = '';
  varsOpcion = ['Activas','Terminadas'];
  eltipo = '';

  idDato = '';
  objDato: Nucleo;

  modalRefNuc: NgbModalRef;
  closeResult = '';

  // data own business
  private ObjData: Dato;

  constructor(
    private excsrv: ExceljsService,
    private citsrv: CitasService,
    private nucsrv: NucleosService,
    private modalService: NgbModal,
    private logsrv: LoginService,
    private datsrv: DatosService) { }

  ngOnInit() {

             // get data busisness
             this.datsrv.getDato('1').subscribe(
              resdat => {
                this.ObjData = resdat;
              }
            );


    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    this.fecini = formatDate(new Date(anio,0,1), 'yyyy-MM-dd',"en-US");
    this.fecfin = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    
    this.afecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
     if (mes <= 10) {
       this.afecfin = formatDate(new Date(anio,mes+2,0), 'yyyy-MM-dd',"en-US");
    } else {
      this.afecfin = formatDate(new Date(anio+1,0,20), 'yyyy-MM-dd',"en-US");
    }
    this.eltipo = this.varsOpcion[0];
    this.elusu = this.logsrv.getUsuarioFromStorage();

  }

  cargo() {
    this.nucsrv.getNucleo(this.idDato.trim()).subscribe(
      resafi => {
        if (resafi != null && resafi !== undefined) {
          this.objDato = resafi;
          this.siesta();
        } else  {
          this.swaltit = 'Atención';
          this.swalmsg = 'Núcleo inexistente';
          Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
            confirmButtonText: 'OK',
          });
        }

      }, error => {
        this.swaltit = 'Atención';
        this.swalmsg = 'Error al leer núcleo';
        Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  siesta() {
    this.lista = [];
    const lafecini = this.afecini.substr(0, 4) + this.afecini.substr(5, 2) + this.afecini.substr(8, 2);
    const lafecfin = this.afecfin.substr(0, 4) + this.afecfin.substr(5, 2) + this.afecfin.substr(8, 2);
    
    this.citsrv.getCitasNucFec(this.idDato.trim(), this.fecini, this.fecfin).subscribe(
      recita => {
        for (const poema of recita) {
          let estava = true;
          if (this.eltipo.trim() === this.varsOpcion[0]){
            if (poema.status === 'Cancelada' || poema.status === 'Cumplida'){
              estava = false;
            }
          } else {
            if (poema.status !== 'Cancelada' && poema.status !== 'Cumplida'){
              estava = false;
            }
          }
          if (estava) {
            if (poema.fecagenda != null && poema.fecagenda !== undefined){
              const lagenda = formatDate(poema.fecagenda, 'yyyyMMdd',"en-US");
              if (lagenda < lafecini || lagenda > lafecfin) {
                estava = false;
              }
            }
          }
          if (estava) {
            this.lista.push(poema);
          }
        }
        if (this.lista.length === 0) {
          this.swaltit = 'Atención';
          this.swalmsg = 'No se encontraron consultas en esos rangos';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
          });
        }
      }
    );
  }

  onChangeTipo(item){
    this.eltipo = item;
  }

  cambioId(mellega) {
    this.idDato = mellega;
      //@todo valido que sean numeros
      if (this.idDato === undefined ||
        this.idDato === null ||
        this.idDato.trim() ==='' ) {
        this.swaltit = 'Atención';
        this.swalmsg = 'El núcleo no puede estar vacío';
        Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
      this.nucsrv.getNucleo(this.idDato.trim()).subscribe(
        resafi => {
          if (resafi != null && resafi !== undefined) {
            this.objDato = resafi;
          } else  {
            this.swaltit = 'Atención';
            this.swalmsg = 'Núcleo inexistente en el padrón';
            Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'warning',
              confirmButtonText: 'OK',
            });
          }

        }, error => {
          this.swaltit = 'Atención';
          this.swalmsg = 'Error al leer núcleo';
          Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      );
  }

  // boton para buscar nucleo 
  openNuc(content) {
    this.modalRefNuc = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    this.modalRefNuc.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  elijoNuc(){
    this.idDato = this.objDato.id.toString();
    this.modalService.dismissAll();
  }

        // exportar a excel tabla de calendario de citas
        exportToExcel(): void {
          const lisXls = [];
      
          for (let i = 0; i < this.lista.length; i++) {
    
      
                lisXls.push([
                  new Date(this.lista[i].fecsol),
                  this.lista[i].afiliado ? this.lista[i].afiliado.cedula : "" ,
                  (this.lista[i].afiliado ? this.lista[i].afiliado.nombres : "") + " " +(this.lista[i].afiliado ? this.lista[i].afiliado.apellidos : ""),
                  this.lista[i].nucleo ? this.lista[i].nucleo.nombre : "",
                  this.lista[i].motivo,
                  this.lista[i].prefiere,
                  this.lista[i].status,
                  this.lista[i].fecagenda ? new Date(this.lista[i].fecagenda) : "Sin definir",
                  this.lista[i].abogado ? this.lista[i].abogado : "Sin definir", 
                  this.lista[i].resultado ? this.lista[i].resultado : "",
                ]);
              }
      
          const pHeader = ["Solicitado","Cedula","Afiliado", "Nucleo", "Motivo", "Fec.Prefiere", "Estado", "Fec.Agenda","Abogado","Resultado"];
          const pCol = [15,15,40, 15, 40, 15, 15, 15, 15,40];
          const pTit = 'Informe';
          let pSubtit = "Calendario de consultas por afiliados";    
      
          this.excsrv.generateExcelFix(
            pTit, pSubtit, this.ObjData,
            pHeader, pCol, lisXls, [],
            [], [], [],
            {}
          );
        }

}
