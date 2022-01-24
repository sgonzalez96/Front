import { Nucleo } from './../../../Afiliados/models/nucleo';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { DatosService } from '../../../Admin/services/datos.service';
import { GenerarPdfService } from '../../serv/generar-pdf.service';
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
import { MovContDet } from '../../models/movcondet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rec-nucleo',
  templateUrl: './rec-nucleo.component.html',
  styleUrls: ['./rec-nucleo.component.css']
})
export class RecNucleoComponent implements OnInit, OnDestroy {

  // subscriptions
  private $Sub: Subscription[] = [];

  // data own business
  private ObjData: Dato;

  // modal
  objNuc: Nucleo = new Nucleo();
  modalRefNuc: NgbModalRef;

  // form
  public formNucleo: FormGroup;
  public fechInic: String;
  public fechEnd: String;


  pageSettings = pageSettings;
  lista: MovCont[];
  objMov: MovCont;
  swaltit: string;
  swalmsg: string;




  constructor(
    private movsrv: MovcontService,
    private datsrv: DatosService,
    private modalService: NgbModal,
    private nucsrv: NucleosService,
    private _formBuild: FormBuilder,
    private _excel: ExceljsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formNucleo = _formBuild.group({
      fecini: ['', Validators.required],
      fecfin: ['', Validators.required],
      nucleoId: ['', Validators.required],
      nucleoName: ['', Validators.required],
    });

    this.pageSettings.pageWithFooter = true;

    this.fechInic = formatDate(new Date(Date.now() - 3000000000), 'yyyy-MM-dd', "en-ES");
    this.fechEnd = formatDate(new Date(Date.now()), 'yyyy-MM-dd', "en-ES");

  }


  public get dataForm(): any {
    return {
      fecini: this.formNucleo.controls.fecini.value,
      fecfin: this.formNucleo.controls.fecfin.value,
      nucleo: this.formNucleo.controls.nucleoId.value
    }
  }

  ngOnInit() {

    //get data 
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.ObjData = resdat;
      }
    );


    // get data busisness
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.ObjData = resdat;
      }
    );

    this.loadCache();

  }

  // save data in cache --------------------------------------------------------------------------------
  cache() {
    console.log("cache");
    sessionStorage.setItem("nucleoId", this.formNucleo.controls.nucleoId.value);
    sessionStorage.setItem("nucleoName", this.formNucleo.controls.nucleoName.value);
    sessionStorage.setItem("Nucleofecini", this.formNucleo.controls.fecini.value);
    sessionStorage.setItem("Nucleofefin", this.formNucleo.controls.fecfin.value);
  }

  loadCache() {
    if (sessionStorage.getItem("Nucleofecini") && sessionStorage.getItem("Nucleofefin")) {
      this.fechInic = sessionStorage.getItem("Nucleofecini");
      this.fechEnd = sessionStorage.getItem("Nucleofefin");
      this.formNucleo.controls.fecini.setValue(sessionStorage.getItem("Nucleofecini"));
      this.formNucleo.controls.fecfin.setValue(sessionStorage.getItem("Nucleofefin"));
    }

    if (sessionStorage.getItem("nucleoId") && sessionStorage.getItem("nucleoName")) {
      this.formNucleo.controls.nucleoId.setValue(sessionStorage.getItem("nucleoId"));
      this.formNucleo.controls.nucleoName.setValue(sessionStorage.getItem("nucleoName"));
    }

    this.onSubmit();

  }


  // form-------------------------------------------------------------------------------
  // comprobar fecha mayor que fecha ultimo recibo 
  onChangeDate(): boolean {

    let fechini = new Date(this.formNucleo.controls.fecini.value);
    let fechfin = new Date(this.formNucleo.controls.fecfin.value);
    if (fechfin < fechini) {
      Swal.fire({
        title: "Error",
        text: "Los rangos son incorrectos",
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }
    return true;

  }

  // buscar datos
  onSubmit() {
    this.cleanObservables();
    this.clearData();
    // verificar que tenga datos

    if (this.formNucleo.valid && this.onChangeDate()) {
      // cargando el loading
      Swal.fire({
        title: 'Obteniendo datos ... '
      }); Swal.showLoading();
      // obteniendo

      this.getData().then((res) => {
        if (res) {
          Swal.close();
        } else {
          Swal.close();
          Swal.fire({
            title: 'Atencion!',
            text: 'Los datos no fueron encontrados',
            type: 'warning',
          })

        }
      });

    } 
    
  }

  // traer data Promesa
  getData(): Promise<Boolean> {
    let promise: Promise<Boolean> = new Promise((resolve, reject) => {
      this.$Sub.push(
        this.movsrv.getMovcontNucleos(this.dataForm).subscribe((res) => {
          if (res) {
            console.log(res);
            this.lista = res;

            resolve(true);
          } else { reject(false); }
        }, (error) => {

          if (error.status === 0) {
            Swal.fire({
              title: 'Atencion!',
              text: 'Compruebe la conexión a internet',
              type: 'warning',
            });
          };
          if (error.status == 500) {
            Swal.fire({
              title: 'Atencion!',
              text: 'Problemas desde el servidor',
              type: 'warning',
            });
          }
        })
      );


    });
    return promise;
  }

  // generate excel
  exportExcel(): void {
    const lisXls = [];
  
    for (let i = 0; i < this.lista.length; i++) {
      //get mov_cont_det in this mov
      let detail: MovContDet[] =this.lista[i].detalle; 


      lisXls.push([
        new Date(this.lista[i].fecha),
        detail,
        this.lista[i].referencia,
        new Intl.NumberFormat("en-US", {minimumIntegerDigits: 1,minimumFractionDigits: 0,maximumFractionDigits:0} ).format(this.lista[i].recibo),
        new Intl.NumberFormat("en-US", {minimumIntegerDigits: 1,minimumFractionDigits: 0,maximumFractionDigits:0} ).format(this.lista[i].importe),
      ]);
    }

    const pHeader = ["Fecha Recibo", "Fecha | Mes Pago ", "Referencia", "Recibo", "Importe"];
    const pCol = [15,40,40,10,10];
    const pTit = 'Informe Recibos por Núcleo';
    const pSubtit = "Nucleo : "+this.formNucleo.controls.nucleoName.value;
    this._excel.movContMovContDet(
      pTit, pSubtit, this.ObjData,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }





  // modal -----------------------------------------------------------------------------


  openNucleo(content) {
    this.modalRefNuc = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    this.modalRefNuc.result.then(
      (result) => {
        console.log(result);
      }, (reason) => {
        console.log(reason);
      });
  }


  elijoNuc() {

    this.formNucleo.controls.nucleoId.setValue(this.objNuc.id);
    this.formNucleo.controls.nucleoName.setValue(this.objNuc.nombre);
    this.modalRefNuc.close();
  }

  closeNuc() {
    this.modalRefNuc.close();
  }
  cambioNucleoId(elnuc) {
    console.log(elnuc);
    let minucleo = '';
    minucleo = elnuc;
    if (minucleo.trim() === '0') {
      this.swaltit = 'Error!';
      this.swalmsg = 'El nucleo no existe';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'error',
        confirmButtonText: 'OK',
      });
    }



    this.nucsrv.getNucleo(minucleo.trim()).subscribe(
      resnu => {
        if (resnu != null) {
          this.formNucleo.controls.nucleoId.setValue(resnu.id);
          this.formNucleo.controls.nucleoName.setValue(resnu.nombre);
        } else {
          this.swaltit = 'Error!';
          this.swalmsg = 'El nucleo no existe';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });

        }
      }, error => {
        this.swaltit = 'Error!';
        this.swalmsg = 'El nucleo no existe';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }


  // clear data -----------------------------------------------------------------------------------------
  // clear data array 
  clearData() {
    this.lista = [];
  }
  // clear all observables
  cleanObservables() {
    this.$Sub.forEach(element => {
      element.unsubscribe();
    });
  }

  // clear data from observables 
  ngOnDestroy(): void {
    this.$Sub.forEach(res => {
      res.unsubscribe();
    });
  }
}
