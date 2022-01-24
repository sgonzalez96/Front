import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Cita } from '../../models/citalegal';
import { citaDTO } from '../../models/citadto';
import { Usuario } from '../../../Admin/models/usuario';
import { CitasService } from '../../serv/citas.service';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Abogado } from '../../models/abogado';
import { AbogadosService } from '../../serv/abogados.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';

@Component({
  selector: 'app-cita-verabo',
  templateUrl: './cita-verabo.component.html',
  styleUrls: ['./cita-verabo.component.css']
})
export class CitaVeraboComponent implements OnInit {
  pageSettings = pageSettings;
  lista: Cita[]=[];

  elusu: Usuario;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  afecini = '';
  afecfin = '';
  varsOpcion = ['Activas', 'Terminadas'];
  eltipo = '';

  abogados: Abogado[] = [];
  objDato: Abogado;
  // data own business
  private ObjData: Dato;

  constructor(
    private citsrv: CitasService,
    private abosrv: AbogadosService,
    private logsrv: LoginService,
    private datsrv: DatosService,
    private excsrv: ExceljsService) { }

  ngOnInit() {

    // get data busisness
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.ObjData = resdat;
      }
    );


    this.abosrv.getAbogados().subscribe(
      resab => {
        resab.forEach(elemt => {
          if (elemt.activo) {
            this.abogados.push(elemt)
          }
        });
        this.objDato = this.abogados[0];
      }
    );


    const anio = new Date().getFullYear();
    const mes = new Date().getMonth();
    this.fecini = formatDate(new Date(anio, 0, 1), 'yyyy-MM-dd', "en-US");
    this.fecfin = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    this.afecini = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    if (mes <= 10) {
      this.afecfin = formatDate(new Date(anio, mes + 2, 0), 'yyyy-MM-dd', "en-US");
    } else {
      this.afecfin = formatDate(new Date(anio + 1, 0, 20), 'yyyy-MM-dd', "en-US");
    }
    this.eltipo = this.varsOpcion[0];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.cargo();
  }

  onChangeAbo(elabo) {
    for (const abogado of this.abogados) {
      if (elabo.trim() === abogado.nombre.trim()) {
        this.objDato = abogado;
        break;
      }
    }
  }

  cargo() {
    this.lista = [];
    const lafecini = this.afecini.substr(0, 4) + this.afecini.substr(5, 2) + this.afecini.substr(8, 2);
    const lafecfin = this.afecfin.substr(0, 4) + this.afecfin.substr(5, 2) + this.afecfin.substr(8, 2);

    this.citsrv.getCitasAboFec(this.objDato.id, this.fecini, this.fecfin).subscribe(
      recita => {
        for (const poema of recita) {
          let estava = true;
          if (this.eltipo.trim() === this.varsOpcion[0]) {
            if (poema.status === 'Cancelada' || poema.status === 'Cumplida') {
              estava = false;
            }
          } else {
            if (poema.status !== 'Cancelada' && poema.status !== 'Cumplida') {
              estava = false;
            }
          }
          if (estava) {
            if (poema.fecagenda != null && poema.fecagenda !== undefined) {
              const lagenda = formatDate(poema.fecagenda, 'yyyyMMdd', "en-US");
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

  onChangeTipo(item) {
    this.eltipo = item;
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
            let pSubtit = "Calendario de citas por abogados";    
        
            this.excsrv.generateExcelFix(
              pTit, pSubtit, this.ObjData,
              pHeader, pCol, lisXls, [],
              [], [], [],
              {}
            );
          }


}
