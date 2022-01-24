import { DatosService } from './../../../Admin/services/datos.service';
import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Cita } from '../../models/citalegal';
import { CitasService } from '../../serv/citas.service';
import Swal from 'sweetalert2';
import { citaDTO } from '../../models/citadto';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { formatDate } from '@angular/common';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';

@Component({
  selector: 'app-citalegal',
  templateUrl: './citalegal.component.html',
  styleUrls: ['./citalegal.component.css']
})
export class CitalegalComponent implements OnInit {
  pageSettings = pageSettings;
  lista: Cita[]=[];
  objCita = new Cita();
  objCitaDTO = new citaDTO();
    // data own business
    private ObjData: Dato;

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

  constructor(
    private citsrv: CitasService,
    private logsrv: LoginService,
    private excsrv: ExceljsService,
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
    this.cargo();
  }

  cargo(){
    this.lista = [];
    const lafecini = this.afecini.substr(0, 4) + this.afecini.substr(5, 2) + this.afecini.substr(8, 2);
    const lafecfin = this.afecfin.substr(0, 4) + this.afecfin.substr(5, 2) + this.afecfin.substr(8, 2);
    
    console.log(lafecini,lafecfin);
    this.citsrv.getCitasFecSol(this.fecini, this.fecfin).subscribe(
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
            console.log("aca "+poema.fecagenda);
            if (poema.fecagenda != null && poema.fecagenda !== undefined){
              const lagenda = formatDate(poema.fecagenda, 'yyyyMMdd',"en-US");
              console.log("aca la agenda",lagenda);
              if (lagenda < lafecini || lagenda > lafecfin) {
                estava = false;
                console.log("falsooo");
              }
            }
          }
          if (estava) {
            this.lista.push(poema);
          }
        }

      }
    );
    console.log(this.lista);
  }

  onChangeTipo(item){
    this.eltipo = item;
  }
  baja_cita(idMon) {

    this.swaltit = '¿Desea marcar como anulada la cita?';                   
    this.swalmsg = 'La cita no podrá ser reagendada luego de anulada'; 
    this.swaldos = 'Cancelar';                                     
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idMon);
      }
    });

  }


  teborro(idMon) {
    this.citsrv.getCita(idMon).subscribe(
      resu => {
        this.objCita = resu;
        this.objCitaDTO.textolog = 'Cancelada';
        this.objCita.status = 'Cancelada';
        this.objCitaDTO.usuId = this.elusu.idUser;
        this.objCitaDTO.cita = this.objCita;
        this.citsrv.saveCita(this.objCitaDTO).subscribe(
          resok => {
            Swal.fire({
            title: 'Consulta legal actualizada',
            text: '',
            type: 'success',
            confirmButtonText: 'OK',
            });
            this.cargo();
          }
        );
      }
    );
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
      let pSubtit = "Calendario de consultas";    
  
      this.excsrv.generateExcelFix(
        pTit, pSubtit, this.ObjData,
        pHeader, pCol, lisXls, [],
        [], [], [],
        {}
      );
    }

}
