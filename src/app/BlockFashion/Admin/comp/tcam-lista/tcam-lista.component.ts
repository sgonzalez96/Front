import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Tcam } from '../../models/tcam';
import { Moneda } from '../../models/moneda';
import { Dato } from '../../models/dato';
import { TcamService } from '../../services/tcam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MonedaService } from '../../services/moneda.service';
import { Location } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';

@Component({
  selector: 'app-tcam-lista',
  templateUrl: './tcam-lista.component.html',
  styleUrls: ['./tcam-lista.component.css']
})
export class TcamListaComponent implements OnInit {
  pageSettings = pageSettings;
  lista: Tcam[];
  lamon: Moneda;
  cmbAnios: number[] = []; // = [2020,2021,2022];
  cmbMes: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anio: number;
  mes: string;
  mesid: number;
  objDato: Dato;

//private excsrc: ExceljsService
  
constructor(private tcsrv: TcamService,
    private actRout: ActivatedRoute,
    private monsrv: MonedaService,
    private router: Router,
    private _location: Location,
    private datsrv: DatosService,
    private excsrc: ExceljsService
    ) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.actRout.paramMap.subscribe(
      params => {
        let idMon = params.get('idMon');
        this.datsrv.getDato('1').subscribe(
          resdat => {
            this.objDato = resdat;
          }
        );
        this.monsrv.getMoneda(idMon).subscribe(
          resu => {
            this.lamon = resu;
            const fecha = new Date();
            this.anio = fecha.getFullYear();
            this.mesid = fecha.getMonth() + 1;
            this.mes = this.cmbMes[this.mesid - 1];
            for (let i = 2010; i < 2031; i++ ) {
              this.cmbAnios.push(i);
            }
            this.getTCam();
          }
        );
      }
    );
  }


  getTCam() {
    for (let i = 0; i < 12; i++) {
      if (this.cmbMes[i] === this.mes ) {
        this.mesid = i + 1;
        break;
      }
    }
    const fecini = new Date();
    fecini.setMonth(this.mesid - 1);
    fecini.setFullYear(this.anio);
    fecini.setDate(1);
    const  fecfin = new Date(this.anio, this.mesid, 0);
    const lafecini = formatDate(fecini, 'yyyy-MM-dd',"en-US");
    const lafecfin = formatDate(fecfin, 'yyyy-MM-dd',"en-US");
    Swal.fire({
      title: 'Cargando datos de las cotizaciones ... ',
    });
    Swal.showLoading();
    this.tcsrv.getTCByMonFechas(this.lamon.id, lafecini, lafecfin).subscribe(
      resu => {
        this.lista = resu ;
        Swal.close();
      }, error => {
        Swal.close();
      });
  }


  BorroTC(idTc) {
    Swal.fire({
      title: 'Seguro desea borrar el tipo de cambio?',
      text: 'El valor del tipo de cambio sera eliminado para esa fecha y moneda',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, deseo eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idTc);
      }
    });
  }

  teborro(idTc) {
    this.tcsrv.deleteTC(idTc).subscribe(
      resul => {
        Swal.fire({
          title: 'Exito!',
          text: 'Tipo de cambio eliminado correctamente',
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.getTCam();
        //this.router.navigate(['/tcam-lista', this.lamon.id]);

        },
        error => {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo eliminar el tipo de cambio',
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  onChangeAnio(elanio: number) {
    this.anio = elanio;
    this.getTCam();
  }

  onChangeMes(elmes: string) {
    this.mes = elmes;
    this.getTCam();
  }

  mesAntes() {
    for (let i = 0; i < 12; i++) {
      if (this.cmbMes[i] === this.mes ) {
        if (i === 0) {
          this.mesid = 12;
          this.anio = this.anio - 1
        } else {
          this.mesid = i - 1 + 1;
        }
        this.mes = this.cmbMes[this.mesid - 1];
        this.getTCam();
        break;
      }
    }
  }

  mesProx() {
    for (let i = 0; i < 12; i++) {
      if (this.cmbMes[i] === this.mes ) {
        if (i === 11 ) {
          this.mesid = 1;
          this.anio = this.anio + 1;
        } else {
          this.mesid = i + 1 + 1;
        }
        this.mes = this.cmbMes[this.mesid - 1];
        this.getTCam();
        break;
      }
    }

  }

  exportExcel(): void {
    const fecini = new Date();
    fecini.setMonth(0);
    fecini.setFullYear(1980);
    fecini.setDate(1);
    const  fecfin = new Date(this.anio, this.mesid, 0);
    const lafecini = formatDate(fecini, 'yyyy-MM-dd', 'en-US');
    const lafecfin = formatDate(fecfin, 'yyyy-MM-dd', 'en-US');
    Swal.fire({
      title: 'Cargando datos de las cotizaciones ... ',
    });
    Swal.showLoading();
    this.tcsrv.getTCByMonFechas(this.lamon.id, lafecini, lafecfin).subscribe(
      resu => {
        const lisXls = [];
        const lista2 = resu;
        for (let i = 0; i < lista2.length; i++) {
          lisXls.push([lista2[i].mon.id , lista2[i].mon.descripcion, lista2[i].fecha, lista2[i].valor]);
        }
        const pHeader = ["id","Descripcion","Fecha","Valor"];
        const pCol = [5, 40,20,20];
        const pTit = 'Listado de Monedas y cotizaciones';
        const pSubtit = 'Moneda: ' + this.lamon.descripcion + '(' + this.lamon.simbolo + ')';
        this.excsrc.generateExcelFix(
              pTit, pSubtit, this.objDato,
              pHeader, pCol, lisXls, [],
              [], [], [],
              {}
        );
        Swal.close();
      }, error => {
        Swal.close();
      });


    
  }

  volver(){
    this._location.back();
  }
}



