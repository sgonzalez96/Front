import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Nucleo } from '../../models/nucleo';
import { Dato } from '../../../Admin/models/dato';
import { Usuario } from '../../../Admin/models/usuario';
import { Afiliado } from '../../models/afiliado';
import { NucleosService } from '../../serv/nucleos.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { AfiliadosService } from '../../serv/afiliados.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatosService } from '../../../Admin/services/datos.service';
import Swal from 'sweetalert2';
import { Nucleopaddto } from '../../models/nucleopaddto';
import { InfoMensualDTO } from '../../models/infoMensual';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nucleopadron',
  templateUrl: './nucleopadron.component.html',
  styleUrls: ['./nucleopadron.component.css']
})
export class NucleopadronComponent implements OnInit {

  pageSettings = pageSettings;
  fecha: string = "";
  infoMensual: InfoMensualDTO[] = []; //informe mensual dado un mes 
  lista: Nucleopaddto[];
  objNuc: Nucleo = new Nucleo();
  objDato: Dato;
  filtro = true;
  buscar = '';
  nivel = 0;
  elusu: Usuario = new Usuario();

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  listafi: Afiliado[];
  closeResult = '';

  constructor(
    private nucsrv: NucleosService,
    private excsrv: ExceljsService,
    private logsrv: LoginService,
    private afisrv: AfiliadosService,
    private modalService: NgbModal,
    private datsrv: DatosService,
    private datepipe: DatePipe
    ) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();
    this.lista = [];
    // this.cargoNucleos();
  }

  cargoNucleos() {
    console.log(this.filtro);
    let perfil = 'true';
    if (!this.filtro) {
      perfil = 'false';
    }
    Swal.fire({
      title: 'Cargando datos',
      text: "Esta acción pude demorar varios minutos"
    });
    Swal.showLoading();

    this.nucsrv.getNucleosPadron(perfil).subscribe(
      resu => {
        console.log("me llega");
        console.log(resu);
        this.lista = resu;
        Swal.close();
      }
    );

  }


  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {

      lisXls.push([
        this.lista[i].id,
        this.lista[i].nombre,
        this.lista[i].fecingreso,
        this.lista[i].cotizantes,
        this.lista[i].afiliados,
        this.lista[i].fecultpago,
        this.lista[i].enable
      ]);
    }

    const pHeader = ["id", "Nombre", "Ingreso", "Cotizantes", "Afiliados", "Ult.Pago", "Activo"];
    const pCol = [10, 40, 20, 20, 20, 20, 20, 20];
    const pTit = 'Listado de Padrón de Núcleos';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  emitirInforme() {
    let date = this.fecha.split("-");
    return new Promise((resolve, reject) => {
      this.nucsrv.getInfoMensualNucleos(date[0]+date[1]).subscribe(res => {
        if (res) {
          this.infoMensual = res;
          resolve(true);
        } else {
          reject(false);
        }
      })
    })
  }

  //expor to excel give a month date  
  expExcMes(): void {
    try {
      Swal.fire({
        title:"Este accion puede demorar",
      });Swal.showLoading();
      this.emitirInforme().then(res => {
        Swal.close();
        if (res) {
          if (this.infoMensual) {
            const lisXls = [];
            console.log(this.infoMensual);
            for (let i = 0; i < this.infoMensual.length; i++) {

              lisXls.push([
                this.infoMensual[i].codNucleo || "*****",
                this.infoMensual[i].nombNucleo || "*****",
                this.infoMensual[i].idUltRecibo,
                this.datepipe.transform(this.infoMensual[i].fechUltRecibo,"dd/MM/yyyy"),
                this.infoMensual[i].impUltRecibo,
                this.infoMensual[i].cantCotUltRevibo,
                this.infoMensual[i].mesCancelaUltRecibo || "*****",
                //this.infoMensual[i].observaciones || "*****",
                this.infoMensual[i].cedDelegado || "*****",
                this.infoMensual[i].nombDelegado || "*****",
                this.infoMensual[i].teleDelegado || "*****",
              ]);
            }

            const pHeader = ["Codigo", "Nombre", "Ult.Rec", "Fecha", "Importe", "Cotizantes", "Mes.Rec.Cancelado", "Cedula", "Nombre delegado", "Telefono"];
            const pCol = [10, 40, 20, 20, 20, 20, 20, 20, 20, 40, 20];
            const pTit = 'Informe';
            const pSubtit = '';
            this.excsrv.generateExcelFix(
              pTit, pSubtit, this.objDato,
              pHeader, pCol, lisXls, [],
              [], [], [],
              {}
            );
          }
        }
      }).catch(()=>{Swal.fire("Error", "No se pudo realizar la accion", "error");})
    } catch (error) {
      Swal.fire("Error", "No se pudo realizar la accion", "error");
    } 




  }

  cambioFiltro() {
    this.cargoNucleos();
  }


  opend1(content, nucleo) {
    this.listafi = [];
    this.nucsrv.getNucleo(nucleo).subscribe(
      resu => {
        this.objNuc = resu;
        this.afisrv.getAfiNucleo(nucleo).subscribe(
          resafi => {
            for (const nucafi of resafi) {
              this.listafi.push(nucafi.afiliado);
            }
            this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;
            });
          }
        );
      }
    );
  }

  private getDismissReason2(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
