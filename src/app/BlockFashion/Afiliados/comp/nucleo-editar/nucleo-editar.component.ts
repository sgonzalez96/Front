import { Component, OnInit, OnDestroy, ViewChild, Injectable, Inject, LOCALE_ID } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Nucleo } from '../../models/nucleo';
import { NucleosService } from '../../serv/nucleos.service';
import { ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Via } from '../../../Admin/models/via';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { Ciudad } from '../../../Admin/models/ciudad';
import { CiudadService } from '../../../Admin/services/ciudad.service';
import { Localidad } from '../../../Admin/models/localidad';
import { IMyDateModel, IAngularMyDpOptions, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import { NgbModal, ModalDismissReasons, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Log } from '../../../Admin/models/log';
import { LoginService } from '../../../Tools/serv/login.service';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { AfiliadosService } from '../../serv/afiliados.service';
import { Afiliado } from '../../models/afiliado';
import { AfilNucleo } from '../../models/afilnuc';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';
import { Usuario } from '../../../Admin/models/usuario';
import { id } from '@swimlane/ngx-charts/release/utils';
import { Delegado } from '../../models/delegado';
import { DelegadosService } from '../../serv/delegados.service';

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
  }
  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

@Component({
  selector: 'app-nucleo-editar',
  templateUrl: './nucleo-editar.component.html',
  styleUrls: ['./nucleo-editar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class NucleoEditarComponent implements OnInit, OnDestroy {

  region: string = "";
  pageSettings = pageSettings;
  objNucleo = new Nucleo();
  idNucleo = 0;
  swaltit: string;
  swalmsg: string;
  lopido = false;
  varsVia: Via[];
  laVia: Via = new Via();
  varsCiud: Ciudad[];
  laCiud: Ciudad;
  varsLoc: Localidad[];
  laLoca: Localidad;
  forma = ['Sin definir', 'Asociacion Civil', 'Fundacion', 'S.A.', 'S.R.L.', 'Cooperativa', 'Otros'];
  laforma = 0;
  fecingreso = new Date();
  // fecinipago = new Date();
  closeResult = '';
  lista: Nucleo[];
  active: string;
  lislog: Log[];
  logopen = false;
  listanuc: AfilNucleo[];
  objDato: Dato;

  objDel1 = new Afiliado();
  objDel2 = new Afiliado();
  objAfil = new Afiliado();
  delegado1 = '';
  delegado2 = '';
  listafi: Afiliado[];
  quedele = 0;

  objCiudad: Ciudad;
  objLoc: Localidad;
  listalog: Log[];
  inicia = 0;
  nivel = 0;
  elusu: Usuario = new Usuario();
  listadel: Delegado[];
  objDel: Delegado;

  constructor(private nucsrv: NucleosService,
    private actRout: ActivatedRoute,
    private viasrv: ViapagoService,
    private ciusrv: CiudadService,
    private modalService: NgbModal,
    private perfsrv: UsuarioService,
    private afisrv: AfiliadosService,
    private logsrv: LoginService,
    private excsrv: ExceljsService,
    private datsrv: DatosService,
    private delsrv: DelegadosService,
    @Inject(LOCALE_ID) private locale: string,
    private _location: Location) {
  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();
    this.listadel = [];
    this.varsVia = [];
    this.varsCiud = [];
    this.varsLoc = [];
    this.listanuc = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.viasrv.getVias().subscribe(
      resvi => {
        this.varsVia = resvi;
        this.ciusrv.getCiudades().subscribe(
          resci => {
            console.log(resci);
            this.varsCiud = resci;
            const mevino = this.actRout.snapshot.params['id'];

            if (mevino == 'nuevo') {
              this.lopido = true;
            } else {
              this.idNucleo = mevino;
              this.lopido = false;
              this.getNucleo();
            }
          }
        );
      }
    );
  }

  //get proximo nucleo 
  getProximo(sub: number, reg: string) {
    if (sub != null && sub != 0 && (reg == 'M' || reg == 'I')) {
      Swal.fire({ titleText: "Cargando" });
      Swal.showLoading();
      console.log(sub, reg);
      this.nucsrv.proxNucleo(sub, reg).subscribe((res) => {
        Swal.close();
        if (res) {
          this.inicio_nucleo();
          this.idNucleo = res;
          this.lopido = false;
          this.objNucleo.subgrupo = sub;
        }
      }, err => {
        console.log(err);
        Swal.fire("Error", "Error al ejecutar la accion", "error")
      });
    }else{
      Swal.fire("Alerta","Los datos son incorrectos","warning");
    }
  }

  cargoLog() {
    this.logopen = true;
    this.perfsrv.getLogs('N', this.idNucleo.toString()).subscribe(
      reslog => {
        if (reslog != null && reslog !== undefined) {
          this.lislog = reslog;
        }
      }
    );

  }

  getNucleo() {
    this.nucsrv.getNucleo(this.idNucleo.toString()).subscribe(
      resnuc => {
        if (resnuc != null && resnuc !== undefined) {
          this.objNucleo = resnuc;
          this.laVia = this.objNucleo.via;
          if (this.laVia == null || this.laVia === undefined) {
            this.laVia = this.varsVia[0];
          }
          this.laCiud = this.objNucleo.ciudad;
          // const mifecha = formatDate(this.objNucleo.fecingreso, 'yyyy-MM-dd', this.locale);
          // this.fecingreso = new Date(
          //   parseInt(mifecha.substr(0, 4), 10),
          //   parseInt(mifecha.substr(5, 2), 10) - 1,
          //   parseInt(mifecha.substr(8, 2), 10));

          // const mifecha2 = formatDate(this.objNucleo.fecinipago, 'yyyy-MM-dd', this.locale);
          //   this.fecinipago = new Date(
          //     parseInt(mifecha2.substr(0, 4), 10),
          //     parseInt(mifecha2.substr(5, 2), 10) - 1,
          //     parseInt(mifecha2.substr(8, 2), 10));

          this.cargoLoc();
          this.onChangeFC(this.objNucleo.formacivil);
          if (this.objNucleo.delegado1 != null && this.objNucleo.delegado1 != 0) {
            this.afisrv.getAfiliado(this.objNucleo.delegado1.toString()).subscribe(
              resdel1 => {
                if (resdel1 !== undefined && resdel1 != null) {
                  this.objDel1 = resdel1;
                  this.delegado1 = this.objDel1.apellidos + ", " + this.objDel1.nombres + "Desde: " + this.objNucleo.fecultd1;
                }
              }
            );
          }
          if (this.objNucleo.delegado2 != null && this.objNucleo.delegado2 !== 0) {
            this.afisrv.getAfiliado(this.objNucleo.delegado2.toString()).subscribe(
              resdel2 => {
                if (resdel2 !== undefined && resdel2 != null) {
                  this.objDel2 = resdel2;
                  this.delegado2 = this.objDel2.apellidos + ", " + this.objDel2.nombres + "Desde: " + this.objNucleo.fecultd2;
                }
              }
            );
          }
          this.cargoAfi();
          this.cargoDel();
        } else {
          this.inicio_nucleo();
        }
      }, error => {
        this.inicio_nucleo();
      }
    );
  }

  inicio_nucleo() {
    this.objNucleo = new Nucleo();
    this.objNucleo.id = this.idNucleo;
    this.laVia = this.varsVia[0];
    this.laCiud = this.varsCiud[0];
    this.cargoLoc();
    this.laforma = 0;
    this.fecingreso = new Date();
    // this.fecinipago = new Date();
    this.objDel1 = new Afiliado();
    this.objDel2 = new Afiliado();
    this.listafi = [];
    this.objNucleo.subgrupo = this.inicia;
  }

  cargoDel() {
    this.delsrv.getDelNuc(this.idNucleo).subscribe(
      resdel => {
        this.listadel = resdel;
      }
    );
  }

  cargoAfi() {
    this.listafi = [];
    this.afisrv.getAfiNucleo(this.idNucleo.toString()).subscribe(
      resafi => {
        if (resafi !== undefined) {
          for (const afinuc of resafi) {
            if (afinuc.afiliado.enable) {
              this.listafi.push(afinuc.afiliado);
            }
          }
        }
        this.afisrv.getAfiNucleo(this.idNucleo.toString()).subscribe(
          resafinuc => {
            this.listanuc = resafinuc;
          }
        );
      }
    );
  }

  cargoLoc() {
    this.varsLoc = [];
    let sinloc = new Localidad();
    sinloc.id = 0;
    sinloc.nombre = "Sin asignar";
    this.varsLoc[0] = sinloc;
    this.laLoca = this.varsLoc[0];
    this.ciusrv.getLocCiud(this.laCiud.id.toString()).subscribe(
      resloc => {
        if (resloc != null && resloc !== undefined) {
          for (const lolo of resloc) {
            this.varsLoc.push(lolo);
            if (this.objNucleo.loc != null) {
              if (lolo.id === this.objNucleo.loc.id) {
                this.laLoca = lolo;
              }
            }
          }
        }
      }
    );
  }


  creoNucleo(f: NgForm) {
    if (this.objNucleo.nombre == null || this.objNucleo.nombre === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar una descripción';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (this.laLoca.id === 0) {
      this.objNucleo.loc = null;
    } else {
      this.objNucleo.loc = this.laLoca;
    }
    this.objNucleo.ciudad = this.laCiud;
    this.objNucleo.via = this.laVia;
    this.objNucleo.formacivil = this.forma[this.laforma];


    // this.objNucleo.fecinipago = this.fecinipago;
    this.objNucleo.enable = true;
    this.objNucleo.delegado1 = parseInt(this.objDel1.cedula, 10);
    this.objNucleo.delegado2 = parseInt(this.objDel2.cedula, 10);
    console.log(this.objNucleo);
    this.nucsrv.saveNucleo(this.objNucleo).subscribe(
      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'El nucleo fue actualizado correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
      },
      error => {
        this.swaltit = 'Error!';
        this.swalmsg = 'Error al actualizar los datos';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  cambioId(mellega) {
    this.idNucleo = parseInt(mellega, 10);
    if (this.idNucleo.toString() == 'NaN') {
      this.swaltit = 'Atención';
      this.swalmsg = 'El id del núcleo no es válido';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;

    }
    if (true) {
      //@todo valido que sean numeros
      if (this.idNucleo === 999999 ||
        this.idNucleo === undefined ||
        this.idNucleo === null ||
        this.idNucleo === NaN) {
        this.swaltit = 'Atención';
        this.swalmsg = 'El id del núcleo no puede ser nulo o 999999';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
      if (this.idNucleo !== 0 && this.idNucleo !== 1) {
        let idtexto = this.idNucleo.toString();
        this.inicia = parseInt(idtexto.substr(0, 1), 10);
        if (this.inicia < 1 || this.inicia > 7) {
          this.swaltit = 'Atención';
          this.swalmsg = 'El id del núcleo debe empezar entre 1 y 7';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
          return;
        }

      }
      //Lo busco y sino lo creo
      this.getNucleo();
      this.lopido = false;
    }
  }

  reabro() {
    this.lopido = true;
  }

  volver() {
    this._location.back();
  }

  onChangeVia(laVia) {
    for (const via of this.varsVia) {
      if (laVia.trim() === via.nombre.trim()) {
        this.laVia = via;
        break;
      }
    }
  }

  onChangeCiud(city) {
    for (const ciud of this.varsCiud) {
      if (city.trim() === ciud.nombre.trim()) {
        this.laCiud = ciud;
        this.cargoLoc();
        break;
      }
    }
  }

  onChangeLoc(laloca) {
    for (const loca of this.varsLoc) {
      if (laloca.trim() === loca.nombre.trim()) {
        this.laLoca = loca;
        break;
      }
    }
  }

  onChangeFC(lafoca) {
    if (lafoca == null) {
      this.laforma = 0;
    } else {
      for (let i = 0; i < this.forma.length; i++) {
        if (lafoca.trim() === this.forma[i].trim()) {
          this.laforma = i;
          break;
        }
      }
    }
  }

  open(content) {
    this.nucsrv.getNucleos().subscribe(
      resnuc => {
        this.lista = resnuc;
      }
    );
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  elijo(elitem) {
    console.log(elitem);
    const nucleo = elitem;
    this.idNucleo = nucleo.id;
    this.modalService.dismissAll();
    this.getNucleo();
    this.lopido = false;
  }


  opend1(content) {
    this.quedele = 1;
    this.abrod2(content);
  }


  opend2(content) {
    this.quedele = 2;
    this.abrod2(content);
  }

  abrod2(content) {
    this.nucsrv.getNucleos().subscribe(
      resnuc => {
        this.lista = resnuc;
      }
    );
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;
    });
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

  elijo2(elitem) {
    const delegado: Afiliado = elitem;
    if (this.quedele === 1) {
      if (this.objDel2 != null && this.objDel2.cedula !== undefined) {
        if (delegado.cedula.trim() === this.objDel2.cedula.trim()) {
          this.swaltit = 'Atención';
          this.swalmsg = 'Delegada/o quedo igual al suplente ... borre el suplente primero';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        } else {
          this.objDel1 = delegado;
          this.delegado1 = this.objDel1.apellidos + ", " + this.objDel1.nombres + "Desde: HOY";
        }
      } else {
        this.objDel1 = delegado;
        this.delegado1 = this.objDel1.apellidos + ", " + this.objDel1.nombres + "Desde: HOY";
      }
    } else if (this.quedele === 1) {
      if (this.objDel1 != null && this.objDel1 != undefined &&
        delegado.cedula.trim() === this.objDel1.cedula.trim()) {
        this.swaltit = 'Atención';
        this.swalmsg = 'El suplente quedo igual al principal ... borre el principal primero';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK',
        });
      } else {
        this.objDel2 = delegado;
        this.delegado2 = this.objDel2.apellidos + ", " + this.objDel2.nombres + "Desde: HOY";
      }
    } else {
      this.objAfil = delegado;
      this.asociarDelegado();
    }
    this.modalService.dismissAll();
  }

  cleand1() {
    this.objDel1 = new Afiliado();
    this.delegado1 = '';
  }
  cleand2() {
    this.objDel2 = new Afiliado();
    this.delegado2 = '';
  }

  /////// ------------------ Para el alta de ciudades y localidades
  openCiud(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;
    });
  }


  elijoCiudad() {
    this.ciusrv.getCiudades().subscribe(
      resci => {
        this.varsCiud = resci;
        this.objNucleo.ciudad = this.objCiudad;
        this.laCiud = this.objCiudad;
        this.objNucleo.loc = null;
        this.cargoLoc();
      }
    );
    this.modalService.dismissAll();
  }

  openLoc(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;
    });
  }

  elijoLoc() {
    this.objNucleo.loc = this.objLoc;
    this.cargoLoc();
    this.modalService.dismissAll();
  }

  closeCiud() {
    this.modalService.dismissAll();
  }

  ExcelAfil() {
    const lisXls = [];
    let locname = '';
    let ciuname = '';
    let depname = '';
    let del1 = false;
    let del2 = false;
    for (let i = 0; i < this.listanuc.length; i++) {

      if (this.listanuc[i].afiliado.loc != null && this.listanuc[i].afiliado.loc !== undefined) {
        locname = this.listanuc[i].afiliado.loc.nombre;
      }

      if (this.listanuc[i].afiliado.ciudad != null && this.listanuc[i].afiliado.ciudad !== undefined) {
        ciuname = this.listanuc[i].afiliado.ciudad.nombre;
        if (this.listanuc[i].afiliado.ciudad.dep != null && this.listanuc[i].afiliado.ciudad.dep !== undefined) {
          depname = this.listanuc[i].afiliado.ciudad.dep.nombre;
        }
      }
      if (this.objNucleo.delegado1 != null && this.objNucleo.delegado1.toString().trim() === this.listanuc[i].afiliado.cedula.trim()) {
        del1 = true;
      }
      if (this.objNucleo.delegado2 != null && this.objNucleo.delegado2.toString().trim() === this.listanuc[i].afiliado.cedula.trim()) {
        del2 = true;
      }
      lisXls.push([
        this.listanuc[i].afiliado.cedula,
        this.listanuc[i].afiliado.apellidos,
        this.listanuc[i].afiliado.nombres,
        this.listanuc[i].afiliado.email,
        this.listanuc[i].afiliado.direccion,
        depname,
        ciuname,
        locname,
        this.listanuc[i].cotizante ? 'SI' : 'NO',
        del1 ? 'SI' : 'NO',
        del2 ? 'SI' : 'NO',
      ]);
    }

    const pHeader = ["id", "Apellidos", "Nombre", "Email", "Direccion", "Departamento", "Ciudad"
      , "Localidad", "Cotizante", "Delegada/o", "Suplente"];
    const pCol = [10, 40, 40, 40, 40, 20, 20, 20, 10, 10, 10];
    const pTit = 'Listado de Afiliad@s del Núcleo';
    const pSubtit = 'Nucleo: ' + this.objNucleo.id + ' ' + this.objNucleo.nombre;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }


  ExcelLog() {

    this.listalog = [];
    this.perfsrv.getLogs('N', this.idNucleo.toString()).subscribe(
      reslog => {
        this.listalog = reslog;
        this.ExportoLog();
      }
    );
  }

  ExportoLog() {
    const lisXls = [];
    for (let i = 0; i < this.listalog.length; i++) {
      // <td>{{log.id}}</td>
      // <td>{{log.fecha}}</td>
      // <td>{{log.evento}}</td>
      // <td>{{log.descripcion}}</td>
      // <td>{{log.autor.userName}}</td>


      lisXls.push([
        this.listalog[i].id,
        this.listalog[i].fecha,
        this.listalog[i].evento,
        this.listalog[i].descripcion,
        this.listalog[i].autor.userName
      ]);
    }

    const pHeader = ["id", "Fecha", "Evento", "Descripcion", "Autor"];
    const pCol = [5, 15, 20, 50, 20];
    const pTit = 'Listado de actividad del núcleo';
    const pSubtit = 'Nucleo: ' + this.objNucleo.id + ' ' + this.objNucleo.nombre;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  opend3(content) {
    this.quedele = 3;
    this.abrod2(content);
  }


  asociarDelegado() {
    for (let i = 0; i < this.listadel.length; i++) {
      if (this.listadel[i].afiliado.cedula.trim() === this.objAfil.cedula.trim()) {
        this.swaltit = 'Atención';
        this.swalmsg = 'Ya es delegad@ en este núcleo';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
    }
    this.objDel = new Delegado();
    this.objDel.id = 0;
    this.objDel.afiliado = this.objAfil;
    this.objDel.nucleo = this.objNucleo;
    this.objDel.tipo = 'Seguridad y salud laboral';
    this.objDel.fecha = new Date();
    console.log("vamos delegado");
    console.log(this.objDel);
    this.delsrv.saveDelegado(this.objDel).subscribe(
      resdel => {
        this.swaltit = 'Exito';
        this.swalmsg = 'Delegad@ cread@ correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.cargoDel();
      }
    );
  }

  bajarDelegado(idDel) {
    this.delsrv.deleteDelegado(idDel).subscribe(
      resdel => {
        this.swaltit = 'Exito';
        this.swalmsg = 'Delegad@ desasignad@ correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.cargoDel();
      }
    );
  }
}
