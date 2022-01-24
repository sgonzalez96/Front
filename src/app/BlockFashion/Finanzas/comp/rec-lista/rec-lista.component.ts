
import { DatosService } from './../../../Admin/services/datos.service';
import { GenerarPdfService } from './../../serv/generar-pdf.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { MovCont } from '../../models/movcont';
import { Via } from '../../../Admin/models/via';
import { MovcontService } from '../../serv/movcont.service';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';
import { Subscription } from 'rxjs';
import { MovConDetFullDTO } from '../../models/excelRecibos';

@Component({
  selector: 'app-rec-lista',
  templateUrl: './rec-lista.component.html',
  styleUrls: ['./rec-lista.component.css']
})
export class RecListaComponent implements OnInit, OnDestroy {

  // subscriptions
  private $Sub: Subscription[] = [];

  // data own business
  private ObjData: Dato;


  pageSettings = pageSettings;
  lista: MovCont[];
  objMov: MovCont;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  varsOpcion: Via[];
  lavia: Via = new Via();


  constructor(
    private movsrv: MovcontService,
    private viasrv: ViapagoService,
    private logsrv: LoginService,
    private datsrv: DatosService,
    private excsrv: ExceljsService,
    private genPDf: GenerarPdfService) {
    this.pageSettings.pageWithFooter = true;
  }


  ngOnInit() {
    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    this.fecfin = this.fecini;
    let lavia: Via = new Via();
    lavia.nombre = 'Todas los vías de pago';
    lavia.id = 0;
    this.varsOpcion = [];
    this.varsOpcion.push(lavia);

    // get data busisness
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.ObjData = resdat;
      }
    );
    this.viasrv.getVias().subscribe(
      restip => {
        for (const otipo of restip) {
          this.varsOpcion.push(otipo);
        }
        this.lavia = this.varsOpcion[0];
        this.getOrigen();
      }
    );
  }

  getOrigen() {
    sessionStorage.removeItem('recibo_viaId');
    sessionStorage.removeItem('recibo_fecha');
    sessionStorage.removeItem('recibo_desc');
    sessionStorage.removeItem('recibo_refe');
    sessionStorage.removeItem('recibo_movId');
    sessionStorage.removeItem('recibo_pagoId');

    let pepe = '';
    pepe = sessionStorage.getItem('listarec_via');
    console.log(pepe);
    if (pepe != null && pepe != undefined) {
      for (const vivi of this.varsOpcion) {
        if (vivi.id == parseInt(pepe, 10)) {
          this.lavia = vivi;
          break;
        }
      }
    }

    let pepi = '';
    pepi = sessionStorage.getItem('listarec_feci');
    if (pepi != null && pepi != undefined) {
      this.fecini = pepi;
    }

    let pepf = '';
    pepf = sessionStorage.getItem('listarec_fecf');
    if (pepf != null && pepf != undefined) {
      this.fecfin = pepf;
    }
    this.cargo();

  }

  cargo() {
    this.clearData();
    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();
    this.lista = [];
    sessionStorage.setItem('listarec_via', this.lavia ? this.lavia.id.toString() : '0');
    sessionStorage.setItem('listarec_feci', this.fecini);
    sessionStorage.setItem('listarec_fecf', this.fecfin);
    if (this.lavia.id === 0) {
      this.$Sub.push(this.movsrv.getMovs(this.fecini, this.fecfin, 'R', 'R').subscribe(
        resmon => {
          console.log(resmon);
          this.lista = resmon;
          Swal.close();
        }
      ));
    } else {
      sessionStorage.setItem('recibo_viaId', this.lavia.id.toString());
      this.$Sub.push(this.movsrv.getMovsVia(this.fecini, this.fecfin, this.lavia.id.toString(), 'R', 'R').subscribe(
        resmon => {
          console.log(resmon);
          this.lista = resmon;
          Swal.close();
        }
      ));
    }


  }


  onChangeTipo(uno) {
    for (const pipi of this.varsOpcion) {
      if (uno.trim() === pipi.nombre.trim()) {
        this.lavia = pipi;
        if (this.lavia.id == 0) {
          sessionStorage.removeItem('recibo_viaId');
        } else {
          sessionStorage.setItem('recibo_viaId', this.lavia.id.toString());
        }
        break;
      }
    }
  }


  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {

      lisXls.push([
        new Date(this.lista[i].fecha),
        this.lista[i].descripcion,
        this.lista[i].referencia,
        this.lista[i].recibo,
        new Intl.NumberFormat("de-DE", {minimumIntegerDigits: 1,minimumFractionDigits: 0,maximumFractionDigits:0} ).format(this.lista[i].importe),
      ]);
    }


    const pHeader = ["Fecha", "Descripción", "Referencia", "Recibo", "Importe"];
    const pCol = [15, 40, 25, 25, 25];
    const pTit = 'Datos de Movimientos';
    const pSubtit = `Forma de pago: ${this.lista[0].viapago.nombre}`;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.ObjData,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  // export excel from movdet data 
  exportMovDet(){
    Swal.fire({titleText: "Cargando", text:"Esta accion puede demorar unos minutos"});
    Swal.showLoading();
    const promise = new Promise<MovConDetFullDTO[] | null>((resolve, reject)=>{
      this.movsrv.getMovsDTO(this.fecini,this.fecfin,'R', 'R',this.lavia.id).subscribe(res=>{
        if (res) {
          resolve(res);
        }else{reject(null)}
      })
    });

    promise.then(res=>{
      Swal.close();
      if (res != null) {
        console.log(res);
        this.runExportMovExcel(res);
      }else{
        Swal.fire("","No se encontraron datos","info");
      }
    })
  }
  runExportMovExcel(lista: MovConDetFullDTO[]): void {
    const lisXls = [];
    for (let i = 0; i < lista.length; i++) {
        
        
        let year= lista[i].mespago.slice(0,4);
        let mes = lista[i].mespago.slice(4,6);

          lisXls.push([
            lista[i].cedula,
            lista[i].nombre,
            new Date(lista[i].fecmovbco),
            lista[i].recibo,
            lista[i].viadsc,
            lista[i].importe,
            new Date(lista[i].fecrec),
            lista[i].referencia,
            lista[i].descripcion,
            lista[i].nucleoid,
            lista[i].nucleodsc,
            mes+"/"+year,
            lista[i].cantidad,
            lista[i].notas,
          ]);

    }


    const pHeader = ["Cedula","Nombre","Fech Mov", "Nº Recibo", "Tipo", "Monto", "Fecha Rec", "Referencia","Descripción","Núcleo","Nombre", "Mes.Pago", "Cant.Afiliados", "Notas"];
    const pCol = [15,40,15, 15, 15, 15, 15, 20,50,15, 30, 15,15, 50];
    const pTit = 'Listado de recibos';
    let pSubtit=""
    if (this.lavia.id == 0) {
       pSubtit = "Forma de pago: Todas las formas de pago";
    }else{
       pSubtit = `Forma de pago: ${this.lavia.nombre}`;
    }

    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.ObjData,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }


  exportPdf() {
    console.log(this.lista);
    this.genPDf.generarPDF(this.lista);
  }

  inhab(idRec) {
    this.swaltit = '¿Desea eliminar el recibo?';
    this.swalmsg = 'El recibo será eliminado de la base de datos';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        //preguntar al back si estot habilitado para la accion 
        this.movsrv.validarBajaMovCont(idRec).subscribe((res)=>{
          if (res) {
            console.log(res);
            this.teborro(idRec);
          }else{
            Swal.fire({
              title: 'Alerta!',
              text: 'No es el ultimo recibo, desea continuar',
              type: 'warning',
              showCancelButton: true,
              cancelButtonText: 'Cancelar'
            }).then((res)=>{
              if (res.value) {
                this.teborro(idRec);
              }
            })
          }

        })
        
      }
    });

  }


  teborro(idRec) {
    this.movsrv.deleteMovcont(idRec).subscribe(
      resu => {
        this.swaltit = 'Ok';
        this.swalmsg = 'Evento eliminado correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.ngOnInit();
      },
      error => {
        this.swaltit = 'Error';
        this.swalmsg = 'No se pudo eliminar el registro';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  // clear data array 
  clearData() {
    this.lista = [];
  }
  // clear data from observables 
  ngOnDestroy(): void {
    this.$Sub.forEach(res => {
      res.unsubscribe();
    });
  }
}
