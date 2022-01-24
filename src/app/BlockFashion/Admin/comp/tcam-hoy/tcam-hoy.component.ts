import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Moneda } from '../../models/moneda';
import { MonedaService } from '../../services/moneda.service';
import { Tcam } from '../../models/tcam';
import { TcamService } from '../../services/tcam.service';
import { formatDate } from '@angular/common';
import { ValMon } from '../../models/valmon';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-tcam-hoy',
  templateUrl: './tcam-hoy.component.html',
  styleUrls: ['./tcam-hoy.component.css']
})
export class TcamHoyComponent implements OnInit {

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };
  model: IMyDateModel = null;
  lista: ValMon[];
  fecha: Date;
  abierto = false;
  objActual: ValMon;
  mesmax = [31,28,31,30,31,30,31,31,30,31,30,31]

  constructor(
    private monsrv: MonedaService,
    private tcamsrv: TcamService
  ) { }

  ngOnInit() {
    this.model = {isRange: false, singleDate: {jsDate: new Date()}};
    this.cargoTC();


  }

  cargoTC() {
    this.abierto = false;
    this.fecha = this.model.singleDate.jsDate;
    this.lista = [];
    const fechoy  = formatDate(this.fecha, 'yyyy-MM-dd',"en-US");
    this.tcamsrv.getTCValMon(fechoy).subscribe(
      resval => {
        this.lista  = resval;
        if (this.lista.length === 1) {
          if (this.lista[0].valnew === 0) {
            this.objActual = this.lista[0];
            this.abierto = true;
          }
        }
      }
    );
  }
  
  cambio(event: IMyDateModel) {
    this.cargoTC();
    
  }

  diaAntes() {

    // const fecini = new Date();
    // fecini.setMonth(this.mesid - 1);
    // fecini.setFullYear(this.anio);
    // fecini.setDate(1);
    // const  fecfin = new Date(this.anio, this.mesid, 0);
    // const lafecini = formatDate(fecini, 'yyyy-MM-dd',"en-US");
    // const lafecfin = formatDate(fecfin, 'yyyy-MM-dd',"en-US");
    //const lafec = formatDate(fecha, "yyyy-MM-dd","en-US");

    const fecha = this.model.singleDate.jsDate;
    let nuevafecha = new Date();

    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let anio = fecha.getFullYear();
    if (dia > 1) {
      dia = dia - 1;
    } else {
      dia = 0;
      if (mes > 1) {
        mes = mes - 1;
      } else {
        mes = 12;
        anio = anio - 1;
      }
    }
    nuevafecha.setDate(dia);
    nuevafecha.setMonth(mes);
    nuevafecha.setFullYear(anio);

    this.model = {isRange: false, singleDate: {jsDate: nuevafecha}};
    this.cargoTC();
  }

  diaProx() {
    const fecha = this.model.singleDate.jsDate;
    let nuevafecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth();
    let anio = fecha.getFullYear();
    if (dia < this.mesmax[mes]) {
      dia = dia + 1;
    } else {
      dia = 1
      if (mes < 12) {
        mes = mes + 1;
      } else {
        mes = 1;
        anio = anio + 1;
      }
    }
    nuevafecha.setDate(dia);
    nuevafecha.setMonth(mes);
    nuevafecha.setFullYear(anio);

    this.model = {isRange: false, singleDate: {jsDate: nuevafecha}};
    this.cargoTC();
  }

  edito(item){
    this.objActual = item;
    this.abierto = true;
  }

  cerrar(){
    this.abierto = false;
  }

  creoTC(f: NgForm) {
    this.abierto = false;
    let tcam: Tcam = new Tcam();
    tcam.mon = this.objActual.mon;
    tcam.id = this.objActual.tcid;
    if (tcam.id === 0) {
      tcam.id = null;
    }
    tcam.fecha = this.fecha;
    tcam.valor = this.objActual.valnew;
    
    if (this.objActual.valnew == 0 || tcam.id === 0) {
      this.tcamsrv.deleteTC(tcam.id).subscribe(
        resdel => {
          this.cargoTC();
        }
      );
    } else {
      
      this.tcamsrv.saveTC(tcam).subscribe(
        restc => {
          this.cargoTC();
        }
      );
    }
  }
}
