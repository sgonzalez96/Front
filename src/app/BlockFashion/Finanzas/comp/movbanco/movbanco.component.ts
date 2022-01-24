import { Component, OnInit, ViewChild, ɵsetCurrentInjector } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { BcoMov } from '../../models/bcomov';
import { MovbcoService } from '../../serv/movbco.service';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import Swal from 'sweetalert2';
import { Via } from '../../../Admin/models/via';
import { ViapagoService } from '../../../Admin/services/viapago.service';

@Component({
  selector: 'app-movbanco',
  templateUrl: './movbanco.component.html',
  styleUrls: ['./movbanco.component.css']
})
export class MovbancoComponent implements OnInit {

  pageSettings = pageSettings;
  lista: BcoMov[];
  objMov: BcoMov;
  objDato: Dato;
  via: Via;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  estini = ' ';
  estfin = 'X';
  varsOpcion = ['Todos', 'Pendientes', 'Conciliados', 'Descartados'];
  laopcion = '';


  pido_csv = false;
  public records: any[] = [];
  @ViewChild('csvReader', null) csvReader: any;
  listaDTO: BcoMov[];
  lismov: BcoMov[];
  resultado = false;
  closeResult = '';
  porc_err = 0;
  porc_ok = 0;
  porc_war = 0;
  cant_err = 0;
  cant_war = 0;
  cant_ok = 0;
  habsub = false;

  constructor(
    private movsrv: MovbcoService,
    private datsrv: DatosService,
    private excsrv: ExceljsService,
    private viasrv: ViapagoService
  ) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    this.fecfin = this.fecini;
    this.laopcion = this.varsOpcion[0];
    if (sessionStorage.getItem('listabco_opc') != null &&
      sessionStorage.getItem('listabco_opc') != undefined) {
      this.laopcion = sessionStorage.getItem('listabco_opc');
      this.fecini = sessionStorage.getItem('listabco_feci');
      this.fecfin = sessionStorage.getItem('listabco_fecf');
    }
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.viasrv.getVia('2').subscribe(
      resvia => {
        this.via = resvia;
      }
    );

    this.cargo();
  }


  cargo() {
    this.lista = [];
    sessionStorage.setItem('listabco_opc', this.laopcion);
    sessionStorage.setItem('listabco_feci', this.fecini);
    sessionStorage.setItem('listabco_fecf', this.fecfin);
    if (this.laopcion === this.varsOpcion[1]) {
      this.estini = ' ';
      this.estfin = 'B';
    } else if (this.laopcion === this.varsOpcion[2]) {
      this.estini = 'C';
      this.estfin = 'C';
    } else if (this.laopcion === this.varsOpcion[3]) {
      this.estini = 'X';
      this.estfin = 'X';
    } else {
      this.estini = ' ';
      this.estfin = 'X';
    }
    Swal.fire({
      title: 'Cargando informacion ... '
    });
    Swal.showLoading();
    this.movsrv.getMovs(this.fecini, this.fecfin, this.estini, this.estfin, '2', '2').subscribe(
      resmov => {
        this.lista = resmov;
        Swal.close();
      }
    );
  }


  onChangeTipo(uno) {
    this.laopcion = uno;
  }

  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {
      let movcont = '';
      if (this.lista[i].movcont != null) {
        movcont = this.lista[i].movcont.id + ' - ' + this.lista[i].descripcion;
      }
      lisXls.push([
        this.lista[i].fecha,
        this.lista[i].descripcion,
        this.lista[i].documento,
        this.lista[i].deposito,
        this.lista[i].asunto,
        this.lista[i].debito,
        this.lista[i].credito,
        this.lista[i].estado,
        movcont
      ]);
    }

    const pHeader = ["Fecha", "Descripción", "Documento", "Depósito", "Asunto", "Débito", "Crédito"
      , "Estado", "Mov.Cont"];
    const pCol = [15, 30, 25, 40, 30, 15, 15, 20, 50];
    const pTit = 'Listado de Movimientos Bancarios';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }


  // ---------------------------- Manejo de la importacion de CSV -------------------------
  // --------------------------------------------------------------------------------------
  pido_archivo() {
    this.pido_csv = true;
  }
  //leer el archivo
  uploadListener($event: any): void {
    let csvRecordsArray: Array<string> = [];
    let headersRow = [];
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };


      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      alert("Este archivo CSV no es valido, debe tener format: cedula");
      this.fileReset();
    }
  }




  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      //if (curruntRecord.length == headerLength) {
      if (curruntRecord.length >= 1) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.fecha = curruntRecord[0].trim();

        csvRecord.descripcion = '';
        if (curruntRecord[1] !== undefined) {
          csvRecord.descripcion = curruntRecord[1].trim();
        }

        csvRecord.documento = '';
        if (curruntRecord[2] !== undefined) {
          if (curruntRecord[2].length == 0) {
            csvRecord.documento = "0";
          } else {
            csvRecord.documento = curruntRecord[2].trim();
          }
        }

        csvRecord.deposito = '';
        if (curruntRecord[4] !== undefined) {
          csvRecord.deposito = curruntRecord[4].trim();
        }

        csvRecord.asunto = '';
        if (curruntRecord[3] !== undefined) {
          csvRecord.asunto = curruntRecord[3].trim();
        }

        csvRecord.debito = 0;
        if (curruntRecord[5] !== undefined) {
          csvRecord.debito = curruntRecord[5];
        }

        csvRecord.credito = 0;
        if (curruntRecord[6] !== undefined) {
          csvRecord.credito = curruntRecord[6];
        }

        if (csvRecord.fecha !== undefined &&
          csvRecord.fecha.trim() !== '' &&
          csvRecord.documento !== undefined &&
          csvRecord.documento.trim() !== '') {
          // csvRecord.firstName = curruntRecord[1].trim();
          // csvRecord.lastName = curruntRecord[2].trim();
          // csvRecord.age = curruntRecord[3].trim();
          // csvRecord.position = curruntRecord[4].trim();
          // csvRecord.mobile = curruntRecord[5].trim();
          csvArr.push(csvRecord);
          this.habsub = true;
        }
      } else {
        alert("Hay lineas de largo incorrecto ... ")
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    console.log("en headers", headers);

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    console.log("vuelve ", headerArray);
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
  }


  agrego_csv(f: NgForm) {
    // pensar el evento de la lista para editar, agregar o borrar segun le llegue id o no y una accion "ABM"
    // hay que llamar al evento que manda un saque de invitaciones y que las chequee por existencia de afiliado
    // y duplicados a bajo nivel, cambiar el icono por procesando ... hasta que termine
    this.lismov = [];
    for (const lalo of this.records) {
      let lalin: BcoMov = new BcoMov();
      if (lalo.fecha != null) {
        let anio = parseInt(lalo.fecha.substr(6, 4), 10);
        let mes = parseInt(lalo.fecha.substr(3, 2), 10) - 1;
        let dia = parseInt(lalo.fecha.substr(0, 2), 10);

        // condiciones
        if (!lalo.documento) {
          lalin.documento = '0';
        }

        lalin.fecha = new Date(anio, mes, dia);
        lalin.descripcion = lalo.descripcion;
        lalin.documento = lalo.documento;
        lalin.deposito = lalo.deposito;
        lalin.asunto = lalo.asunto;
        lalin.debito = lalo.debito;
        lalin.credito = lalo.credito;
        lalin.movcont = null;
        lalin.estado = ' ';
        lalin.banco = 'BROU';
        lalin.via = this.via;
        this.lismov.push(lalin);
      }
    }
    this.listaDTO = [];
    this.cant_err = 0;
    this.cant_ok = 0;
    this.cant_war = 0;
    this.porc_err = 0;
    this.porc_ok = 0;
    this.porc_war = 0;


    this.movsrv.saveMovBcoLis(this.lismov).subscribe(
      resinv => {
        this.cargo();

      }, error => {
        console.log("error");
        console.log(error);
        console.log("message");
        console.log(error.error.message);
        this.swaltit = 'Error';
        this.swalmsg = error.error.message;
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
    this.pido_csv = false;
  }

  cierro_csv() {
    this.pido_csv = false;
  }

  //----------------------------------------

  inhab(idRec) {
    // this.swaltit = '¿Desea descartar el movimiento contable?';
    // this.swalmsg = 'El recibo será eliminado de la base de datos';
    // this.swaldos = 'Cancelar';
    // Swal.fire({
    //   title: this.swaltit,
    //   text: this.swalmsg,
    //   type: 'warning',
    //   showCancelButton: true,
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.value) {
    //     this.teborro(idRec);
    //   }
    // });
    this.cambioest(idRec);
  }

  clonar(idRec) {
    this.swaltit = '¿Desea clonar el movimiento contable?';
    this.swalmsg = 'Esta funcionalidad se utiliza para poder asociar multiples recibos al mismo registro';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.movsrv.getMovBco(idRec).subscribe(
          bcomov => {
            this.objMov = bcomov;
            this.objMov.id = 0;
            this.objMov.estado = ' ';
            this.objMov.movcont = null;
            this.objMov.credito = 0;
            this.objMov.debito = 0;
            this.movsrv.saveMovBco(this.objMov).subscribe(
              resoka => {
                this.swaltit = 'Ok';
                this.swalmsg = 'Movimiento clonado !';
                Swal.fire({
                  title: this.swaltit,
                  text: this.swalmsg,
                  type: 'success',
                  confirmButtonText: 'OK',
                });
                this.cargo();
              }
            );
          }
        );
      }
    });
  }


  cambioest(idRec) {
    this.movsrv.getMovBco(idRec).subscribe(
      resmov => {
        this.objMov = resmov;
        if (this.objMov.estado.trim() === '') {
          this.objMov.estado = 'X';
        } else if (this.objMov.estado.trim() === 'X') {
          this.objMov.estado = ' ';
        }
        this.movsrv.saveMovBco(this.objMov).subscribe(
          resu => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Estado modificado';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.cargo();
          },
          error => {
            this.swaltit = 'Error';
            this.swalmsg = 'No se pudo modificar el registro';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    );
  }
}

export class CSVRecord {
  public fecha: any;
  public descripcion: any;
  public documento: any;
  public deposito: any;
  public asunto: any;
  public debito: any;
  public credito: any;
}
