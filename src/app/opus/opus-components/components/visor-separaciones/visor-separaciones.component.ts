import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ZoomSeparacionComponent } from '../zoom-separacion/zoom-separacion.component';
import { formatDate } from "@angular/common";
import { SeparationHeader } from '../../models/separation-header';
import { VisoresService } from '../../services/visores.service';

import * as fs from "file-saver";
import * as ExcelJS from 'exceljs';

interface Estado {
  id: string;
  dsc: string;
}

@Component({
  selector: 'app-visor-separaciones',
  templateUrl: './visor-separaciones.component.html',
  styleUrls: ['./visor-separaciones.component.scss']
})
export class VisorSeparacionesComponent implements OnInit {

  lista: SeparationHeader[] = [];
  filtrados: SeparationHeader[] = [];
  feci:any;
  fecf:any;
  estado = 'S';
  estados: Estado[] = [];
  selectedState: Estado = {id: 'S', dsc: 'En separación'};

  constructor(private viser: VisoresService, public dialogService: DialogService) { }

  ngOnInit() {
    this.cargoEstados();
    this.feci = formatDate(new Date(), 'YYYY-MM-dd', "en-US");
    this.fecf = formatDate(new Date(), 'YYYY-MM-dd',"en-US");
    this.cargoData();
  }

  cargoData() {
    this.lista = [];
    this.filtrados = [];
    console.log(this.selectedState);
    console.log(this.selectedState.id + '//' + this.feci + '//' + this.fecf);
    this.viser.findSeparationByStateDates(this.selectedState.id, this.feci, this.fecf).subscribe(
      resu => {
        console.log(resu);
        this.lista = resu;
        this.filtrados = resu;
      }, error => {
        console.log(error);
      }
    );
  }

  cargoEstados() {
    this.estados.push({id: 'S', dsc: 'En separación'});
    this.estados.push({id: 'T', dsc: 'Terminadas'});
    this.estados.push({id: 'L', dsc: 'Abiertas sin asignación'});
    this.estados.push({id: '*', dsc: 'Todas'});
  }

  zoom(sepa: SeparationHeader) {
    console.log(sepa);
    const ref = this.dialogService.open(ZoomSeparacionComponent, {
      data: {
          separacion: sepa
      },
      header: 'Zooming de separación',
      width: '80%',
      baseZIndex: 10000
    });
  }

  excel() {
    const header = ["Fecha", "Hora", "Documentos", "Expedientes", "Cliente", "Deposito", "Carril", "Estado", "Usuario"];
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Hoja 1");
    let headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell:any, number:number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ECC1C1" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    const lisXls = [];
    for (let ff of this.filtrados) {
      const lafe = formatDate(ff.fecha, "dd/MM/yyyy", "en-US");
      const lahora = formatDate(ff.fecha, "hh:MM", "en-US");
      let devol = 'S/D';
      switch (ff.status) {
        case 'S':
          devol = 'En separación';
          break;

        case 'T':
          devol = 'Terminada';
          break;

        case 'L':
          devol = 'Sin usuario';
          break;
        case 'P':
          devol = 'Pendiente';
          break;
      }
      lisXls.push([
        lafe, lahora, ff.documentos, ff.expedientes, ff.clientDsc, ff.storageERP, ff.lane, devol, ff.usuario
      ]);
    }
    lisXls.forEach((d) => {
      let row = worksheet.addRow(d);
    });

    const cols = [14,8,45,45,30,12,6,15,20];
    for (let i = 0; i < cols.length; i++) {
      if (cols[i] > 0) {
        worksheet.getColumn(i + 1).width = cols[i];
      }
    }

    //Generate Excel File with given names
    workbook.xlsx.writeBuffer().then((datun:any) => {
      let blob = new Blob([datun], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fs.saveAs(
        blob,
        "xls" + formatDate(new Date(), "yyyy-MM-dd hh-MM-ss", "en-US")
      );
    });
  }

  onFilter(event:any, dt:any) {
    console.log('filtradossss');
    console.log(event.filteredValue);
    console.log('--------------');
    this.filtrados = event.filteredValue;
  }
}
