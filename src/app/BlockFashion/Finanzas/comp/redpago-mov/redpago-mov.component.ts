import { Component, OnInit, ViewChild } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { BcoMov } from '../../models/bcomov';
import { Dato } from '../../../Admin/models/dato';
import { Via } from '../../../Admin/models/via';
import { MovbcoService } from '../../serv/movbco.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { formatDate, PercentPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-redpago-mov',
  templateUrl: './redpago-mov.component.html',
  styleUrls: ['./redpago-mov.component.css']
})
export class RedpagoMovComponent implements OnInit {

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
  porc_ok  = 0;
  porc_war = 0;
  cant_err = 0;
  cant_war = 0;
  cant_ok  = 0;
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
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.fecfin = this.fecini;
    this.laopcion = this.varsOpcion[0];
    if (sessionStorage.getItem('listaredp_opc') != null &&
        sessionStorage.getItem('listaredp_opc') != undefined) {
        this.laopcion = sessionStorage.getItem('listaredp_opc');
        this.fecini = sessionStorage.getItem('listaredp_feci');
        this.fecfin = sessionStorage.getItem('listaredp_fecf');
    }
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.viasrv.getVia('3').subscribe(
      resvia => {
        this.via = resvia;
       }
    );

    this.cargo();
  }


  cargo() {
    this.lista = [];
    sessionStorage.setItem('listaredp_opc', this.laopcion);
    sessionStorage.setItem('listaredp_feci', this.fecini);
    sessionStorage.setItem('listaredp_fecf', this.fecfin);
    if (this.laopcion === this.varsOpcion[1]){
      this.estini = ' ';
      this.estfin = 'B';
    } else if (this.laopcion === this.varsOpcion[2]) {
      this.estini = 'C';
      this.estfin = 'C';
    } else if (this.laopcion === this.varsOpcion[3] ) {
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
    this.movsrv.getMovs(this.fecini,this.fecfin,this.estini,this.estfin,'3','3').subscribe(
      resmov => {
        this.lista = resmov;
        Swal.close();
      }
    );
  }


  onChangeTipo(uno){
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
        this.lista[i].fecha ,
        this.lista[i].descripcion ,
        this.lista[i].documento ,
        this.lista[i].deposito,
        this.lista[i].asunto ,
        this.lista[i].debito ,
        this.lista[i].credito ,
        this.lista[i].estado ,
        movcont
      ]);
    }

    const pHeader = ["Fecha","Descripción","Documento","Depósito","Asunto","Débito","Crédito"
    ,"Estado","Mov.Cont"];
    const pCol = [15, 30,25,40,30,15,15,20,50];
    const pTit = 'Listado de Movimientos RedPagos';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
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


  // ---------------------------- Manejo de la importacion de CSV -------------------------
  // --------------------------------------------------------------------------------------
  pido_archivo() {
    this.pido_csv = true;
  }

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      console.log("vamos o no ... ");
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        console.log("mis record");
        console.log(this.records);
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


        csvRecord.documento = '';
        if (curruntRecord[1] !== undefined){
          csvRecord.documento = curruntRecord[1].trim();
        }

        csvRecord.depositante = '';
        if (curruntRecord[2] !== undefined){
          csvRecord.depositante = curruntRecord[2].trim();
        }

        csvRecord.tidoc = '';
        if (curruntRecord[3] !== undefined){
          csvRecord.tidoc = curruntRecord[3].trim();
        }

        csvRecord.institucion = '';
        if (curruntRecord[4] !== undefined){
          csvRecord.institucion = curruntRecord[4].trim();
        }

        csvRecord.telefono = '';
        if (curruntRecord[5] !== undefined){
          csvRecord.telefono = curruntRecord[5];
        }

        csvRecord.cotizantes = 0;
        if (curruntRecord[6] !== undefined){
          csvRecord.cotizantes = curruntRecord[6];
        }

        csvRecord.meses = '';
        if (curruntRecord[7] !== undefined){
          csvRecord.meses = curruntRecord[7];
        }

        csvRecord.monto = 0;
        if (curruntRecord[9] !== undefined){
          csvRecord.monto = curruntRecord[9];
        }

        csvRecord.subag = '';
        if (curruntRecord[10] !== undefined){
          csvRecord.subag = curruntRecord[10];
        }

        csvRecord.movid = '';
        if (curruntRecord[11] !== undefined){
          csvRecord.movid = curruntRecord[11];
        }

        csvRecord.notas = '';
        if (curruntRecord[12] !== undefined){
          csvRecord.notas = curruntRecord[12];
        }

        if (csvRecord.fecha !== undefined &&
            csvRecord.fecha.trim() !== '' &&
            csvRecord.documento !== undefined &&
            csvRecord.documento.trim() !== '' ) {
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
    console.log("en headers",headers);

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
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
    for (const lalo of this.records){
      console.log("un lalo ",lalo);

      let lalin: BcoMov = new BcoMov();
      if (lalo.fecha != null) {
        let pepe = '';
        pepe = lalo.fecha;
        let dia = 0;
        let mes = 0;
        let anio = 0;
        let van  = 0;
        let pini = 0;
        for (let i =0; i < pepe.trim().length; i++){
          if (pepe.substr(i,1) === '/'){
            if (van === 0) {
              dia = parseInt(pepe.substr(pini, i - pini), 10);
              van = van + 1;
              pini = i + 1;
            } else {
              mes = parseInt(pepe.substr(pini, i - pini), 10) - 1;
              anio = parseInt(pepe.substr(i + 1), 10);
            }
          }
        }

        lalin.fecha = new Date(anio,mes,dia) ;
        lalin.descripcion = lalo.depositante.trim() + ' CI ' + lalo.documento.trim() + ' Inst: ' + lalo.institucion.trim() +
        ' Tel.: ' + lalo.telefono.trim() + ' Cotiz: ' + lalo.cotizantes.trim() + ' Meses: ' + lalo.meses.trim() ;
        lalin.documento = lalo.movid.trim();
        lalin.deposito = lalo.subag.trim();
        lalin.asunto  = lalo.notas.trim();
        lalin.debito = 0;
        lalin.credito = parseInt(lalo.monto, 10);
        lalin.movcont = null;
        lalin.estado = ' ';
        lalin.banco = 'REDPAGO';
        lalin.via = this.via;
        this.lismov.push(lalin);
      }

    }
    console.log("saliiimoooss");
    console.log(this.lismov);
    this.listaDTO = [];
    this.cant_err = 0;
    this.cant_ok  = 0;
    this.cant_war = 0;
    this.porc_err = 0;
    this.porc_ok  = 0;
    this.porc_war = 0;

    this.movsrv.saveMovBcoLis(this.lismov).subscribe(
      resinv => {
        console.log("venismos");
        this.cargo();
      }, error => {
        this.swaltit = 'Error';
        this.swalmsg =  error.error.message;
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

  cierro_csv(){
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


  cambioest(idRec) {
    this.movsrv.getMovBco(idRec).subscribe(
      resmov => {
        this.objMov = resmov;
        if (this.objMov.estado.trim() === ''){
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
  public documento: any;
  public depositante: any;
  public tidoc: any;
  public institucion: any;
  public telefono: any;
  public cotizantes: any;
  public meses: any;
  public mon: any;
  public monto: any;
  public subag: any;
  public movid: any;
  public notas: any;
}
