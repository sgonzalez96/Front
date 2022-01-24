import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Localidad } from './../../models/localidad';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ICotizantes } from '../../models/cotizantes';
import { CotizantesService } from '../../services/cotizantes.service';
import Swal from 'sweetalert2';
import { CiudadService } from '../../services/ciudad.service';
import { Deptos } from '../../models/depto';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../services/datos.service';
import { Dato } from '../../models/dato';
import { AfilNucleo } from '../../../Afiliados/models/afilnuc';

@Component({
  selector: 'app-cotizantes',
  templateUrl: './cotizantes.component.html',
  styleUrls: ['./cotizantes.component.css']
})
export class CotizantesComponent implements OnInit {

  //subscriptions
  private $subs: Subscription[] = [];

  objDato: Dato;
  @ViewChild('modalFilter', null) modalFilter: TemplateRef<NgbModal>;

  //data
  public form: FormGroup;
  public listDataTable: ICotizantes[] = [];
  public listLocalidades: Deptos[] = [];
  public listAfilNucleo: AfilNucleo[]=[];



  constructor(
    private _cotizantes: CotizantesService,
    private modalService: NgbModal,
    private datsrv: DatosService,
    private _formBuilder: FormBuilder,
    private _ciudad: CiudadService,
    private excsrv: ExceljsService) {
    this.form = _formBuilder.group({
      subgrupo: ["", Validators.required],
      dep: ["", Validators.required],
    });
  }

  //get data form
  public get f() {
    return this.form.controls;
  }


  ngOnInit() {
    //datos de la empresa
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }

    );

    //localidades
    this.getLocalidades();


  }

  //get localidades 
  getLocalidades() {
    this.$subs.push(
      this._ciudad.getDeptos().subscribe((res) => {
        if (res) {
          this.listLocalidades = res;
        }
      })
    );
  }

  buscar() {
    if (this.form.valid) {
      console.log(this.f.dep.value);
      console.log(this.f.subgrupo.value);
      Swal.fire({ titleText: "Cargando" });
      Swal.showLoading();
      this.getData().then(res => {
        Swal.close();
        if (res != null) {

          this.listDataTable = res;
        }
      }).catch(err => {
        console.log(err);
        Swal.fire("Error", "Error al ejecutar la accion", "error")
      })
    }
  }

  getData() {
    return new Promise<ICotizantes[] | null>((resolve, reject) => {
      this.$subs.push(
        this._cotizantes.getCotizantes(this.f.subgrupo.value, this.f.dep.value).subscribe((res) => {
          console.log(res);
          if (res) {
            resolve(res);
          } else {
            reject(null)
          }
        })
      )
    })
  }

  //export to excel
  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.listDataTable.length; i++) {
      lisXls.push([
        this.listDataTable[i].codNucleo,
        this.listDataTable[i].nombNucleo,
        this.listDataTable[i].cantCotUltRevibo,
        this.listDataTable[i].cantCotizantes,
        this.listDataTable[i].cantAfiliados,
        this.listDataTable[i].idUltRecibo,
        this.listDataTable[i].mesCancelaUltRecibo,
        this.listDataTable[i].cedDelegado,
        this.listDataTable[i].nombDelegado,
        this.listDataTable[i].teleDelegado,
      ]);
    }

    const pHeader = ["Codigo", "Nombre", "Cant.Ult.Rec", "Cant.Cot", "Cant.Afil", "Id.Ult.Rec", "Mes.Ult.Rec", "Cedula", "Nombre", "Telefono"];
    const pCol = [20, 40, 15, 15, 15, 15, 15, 20, 40, 20];
    const pTit = 'Informe Cotizantes';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  filterAfilNucleo(nuc:number){
    Swal.fire({titleText: "Cargando"});
    Swal.showLoading();
    //creating promise
    const promise = new Promise<AfilNucleo[] | null>((resolve, reject)=>{
      this.$subs.push(
        this._cotizantes.getAfiNucleo(nuc).subscribe(res=>{
        if (res) {
          resolve(res);
        }else{reject(null)}
      }))
      
    });

    //await for promise execute 
    promise.then(res=>{
      Swal.close();
      if (res != null && res.length !=0) {
        console.log(res);
        this.listAfilNucleo = res;
        this.popupProximo(this.modalFilter);
      }else{
        Swal.fire("","No se encontraron datos","info");
      }
    })


  }

  //modal filter
  popupProximo(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
    }, (reason) => {
    });
  }



}
