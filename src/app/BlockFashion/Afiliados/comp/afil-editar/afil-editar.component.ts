import { Component, OnInit, OnDestroy, ViewChild, Injectable, Inject, LOCALE_ID } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Afiliado } from '../../models/afiliado';
import { Ciudad } from '../../../Admin/models/ciudad';
import { Localidad } from '../../../Admin/models/localidad';
import { NucleosService } from '../../serv/nucleos.service';
import { ActivatedRoute } from '@angular/router';
import { AfiliadosService } from '../../serv/afiliados.service';
import { CiudadService } from '../../../Admin/services/ciudad.service';
import { NgbModal, NgbDateAdapter, NgbDateStruct, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Location, formatDate } from '@angular/common';
import { IMyDateModel, IAngularMyDpOptions, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import { CargoService } from '../../../Admin/services/cargo.service';
import { AfilNucleo } from '../../models/afilnuc';
import { Nucleo } from '../../models/nucleo';
import { AfilDto } from '../../models/afildto';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';
import { Log } from '../../../Admin/models/log';
import { LoginService } from '../../../Tools/serv/login.service';
import { Usuario } from '../../../Admin/models/usuario';
import { AfilNota } from '../../models/afilnota';
import { Cargo } from '../../../Admin/models/cargo';
import { Delegado } from '../../models/delegado';
import { DelegadosService } from '../../serv/delegados.service';

// for ngb datepicker adapter
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
  selector: 'app-afil-editar',
  templateUrl: './afil-editar.component.html',
  styleUrls: ['./afil-editar.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class AfilEditarComponent implements OnInit, OnDestroy {
  @ViewChild('dp', null) mydp: AngularMyDatePickerDirective;

  pageSettings = pageSettings;
  objAfil = new Afiliado();
  idAfil = '';
  swaltit: string;
  swalmsg: string;
  lopido = false;
  varsCargo: Cargo[];
  elCargo: Cargo;
  varsCiud: Ciudad[];
  laCiud: Ciudad;
  varsLoc: Localidad[];
  laLoca: Localidad;
  objNucleo: Nucleo;
  forma = ['a) Jefa de hogar', 'b) Niños a cargo', 'c) Adultos mayores a cargo', 'd) discapacitados a cargo', 'e) Otros']
  laforma = 4;
  status = ['Iniciada', 'Sol.Reingreso', 'Aprobada', 'Condicional', 'Terminada', 'Rechazada', 'P.Revision'];
  elstat = 0;
  tipo = ['Afiliada/o', 'Fundador/a', 'Otro/a']
  eltipo = 0;
  //fechaprueba = new Date();
  listanuc: AfilNucleo[];
  nucleos: Nucleo[];
  closeResult = '';
  objFinal = new AfilDto();
  nivel = 0;
  elusu: Usuario = new Usuario();

  elstatus = '';
  objCiudad: Ciudad;
  objLoc: Localidad;
  objDato: Dato;
  listalog: Log[];
  notas: AfilNota[];

  foto: File = null;
  previewUrl: any = null;
  subg = 1;
  cotizante = 0;

  listadel: Delegado[];
  objDel: Delegado;

  constructor(private nucsrv: NucleosService,
    private actRout: ActivatedRoute,
    private afisrv: AfiliadosService,
    private ciusrv: CiudadService,
    private carsrv: CargoService,
    private modalService: NgbModal,
    private excsrv: ExceljsService,
    private datsrv: DatosService,
    private logsrv: LoginService,
    private delsrv: DelegadosService,
    private perfsrv: UsuarioService,
    @Inject(LOCALE_ID) private locale: string,
    private _location: Location) {
  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();

    this.varsCiud = [];
    this.varsLoc = [];
    this.varsCargo = [];
    this.nucleos = [];
    this.listanuc = [];
    this.listadel = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.getCargo();
    this.ciusrv.getCiudades().subscribe(
      resci => {
        this.varsCiud = resci;
        this.idAfil = this.actRout.snapshot.params['id'];
        this.nucsrv.getNucleos().subscribe(
          resnuc => {
            if (resnuc !== undefined) {
              this.nucleos = resnuc;
            }
            if (this.idAfil.trim() === '0') {
              this.lopido = true;
            } else {
              this.lopido = false;
              this.getDelegados();
              this.getAfiliado();
            }
          }
        );


      }
    );
  }

  getCargo() {
    this.subg = 0;
    this.cotizante = 0;
    for (let i = 0; i < this.listanuc.length; i++) {
      this.subg = this.listanuc[i].nucleo.subgrupo;
      if (this.listanuc[i].cotizante) {
        this.cotizante = this.listanuc[i].nucleo.id;
        this.subg = this.listanuc[i].nucleo.subgrupo;
        if (this.subg == 0) {
          this.subg = 1;
        }
        break;
      }
    }
    this.varsCargo = [];
    let uncargo: Cargo = new Cargo();
    uncargo.id = 0;
    uncargo.nombre = '------------';
    uncargo.subgrupo = this.subg;
    this.varsCargo.push(uncargo);
    if (this.elCargo === undefined) {
      this.elCargo = uncargo;
    }

    this.carsrv.getCcargos(this.subg.toString()).subscribe(
      resca => {
        for (const cargo of resca) {
          this.varsCargo.push(cargo);
        }
        this.onChangeCargo(this.elCargo.nombre);
      }
    );

  }

  getDelegados() {
    this.delsrv.getDelAfi(this.idAfil).subscribe(
      resdel => {
        this.listadel = resdel;
        console.log("obtengo lista delegados");
        console.log(this.listadel);
      }
    );
  }

  getAfiliado() {
    this.afisrv.getAfiliado(this.idAfil).subscribe(
      resafi => {
        if (resafi != null && resafi !== undefined) {
          this.objAfil = resafi;
          if (this.objAfil.cargo == null || this.objAfil.cargo === undefined) {
            this.elCargo = this.varsCargo[0];
          } else {
            this.elCargo = this.objAfil.cargo;
          }

          if (this.objAfil.ciudad == null || this.objAfil.ciudad === undefined) {
            this.laCiud = this.varsCiud[0];
          } else {
            this.laCiud = this.objAfil.ciudad;
          }
          // const mifecha = formatDate(this.objAfil.fecnac, 'yyyy-MM-dd', this.locale);
          // this.fechaprueba = new Date(
          //   parseInt(mifecha.substr(0, 4), 10),
          //   parseInt(mifecha.substr(5, 2), 10) - 1,
          //   parseInt(mifecha.substr(8, 2), 10));
          this.objAfil.notas = '';
          this.cargoLoc();
          if (this.objAfil.composicion == null) {
            this.objAfil.composicion = this.forma[0];
          }
          this.onChangeFC(this.objAfil.composicion);

          if (this.objAfil.status == null) {
            this.objAfil.status = this.status[0];
          }
          this.onChangeStat(this.objAfil.status);

          if (this.objAfil.tipo == null) {
            this.objAfil.tipo = this.tipo[0];
          }
          this.onChangeTipo(this.objAfil.tipo);

          this.cargoNucleos();
          this.previewUrl = 'data:image/png;base64,' + this.objAfil.fichaimg;
          this.afisrv.getNotas("A", this.idAfil.toString(), this.nivel.toString()).subscribe(
            resnot => {
              this.notas = resnot;
            }
          );
        } else {
          this.inicio_afiliado();
        }
      }, error => {
        this.inicio_afiliado();
      }
    );
  }

  inicio_afiliado() {
    this.listanuc = [];
    this.objAfil = new Afiliado();
    this.objAfil.cedula = this.idAfil;
    this.laCiud = this.varsCiud[0];
    for (const city of this.varsCiud) {
      if (city.nombre.trim().toLowerCase() === 'sin ciudad') {
        this.laCiud = city;
      }
    }
    this.elCargo = this.varsCargo[0];
    // this.fechaprueba = new Date();
    this.cargoLoc();
    this.laforma = 0;
    this.elstat = 0;
    this.eltipo = 0;
    this.listanuc = [];
    this.notas = [];

    // this.model2 = {isRange: false, singleDate: {jsDate: new Date()}};
    // this.fecinipago = '';
  }

  cargoLoc() {
    this.varsLoc = [];
    let sinloc = new Localidad();
    sinloc.id = 0;
    sinloc.nombre = "Sin asignar";
    this.varsLoc[0] = sinloc;
    this.laLoca = this.varsLoc[0];
    if (this.laCiud != null && this.laCiud != undefined) {
      this.ciusrv.getLocCiud(this.laCiud.id.toString()).subscribe(
        resloc => {
          if (resloc != null && resloc !== undefined) {
            for (const lolo of resloc) {
              this.varsLoc.push(lolo);
              if (this.objAfil.loc != null) {
                if (lolo.id == this.objAfil.loc.id) {
                  this.laLoca = lolo;
                }
              }
            }
          }
        }
      );
    }
  }

  cargoNucleos() {
    console.log("lista de nucleos" + this.objAfil.cedula);
    this.afisrv.getNucAfiliado(this.objAfil.cedula).subscribe(
      resanu => {
        console.log("no se que pasa ");
        console.log(resanu);
        if (resanu !== undefined) {
          this.listanuc = resanu;
          this.getCargo();
          for (let i = 0; i < this.listanuc.length; i++) {
            if (this.listanuc[i].nucleo.delegado1 === parseInt(this.objAfil.cedula, 10)) {
              this.listanuc[i].del1 = true;
            }
            if (this.listanuc[i].nucleo.delegado2 === parseInt(this.objAfil.cedula, 10)) {
              this.listanuc[i].del2 = true;
            }
          }
          for (let j = 0; j < this.listanuc.length; j++) {
            this.listanuc[j].lab = false;
            for (let i = 0; i < this.listadel.length; i++) {
              if (this.listadel[i].afiliado.cedula.trim() === this.objAfil.cedula.trim() &&
                this.listanuc[j].nucleo.id === this.listadel[i].nucleo.id) {
                this.listanuc[j].lab = true;
                break;
              }
            }
          }
        }
      }
    );
  }

  onChangeFecnac(modelito) {
    //  this.mdel1 = modelito;
    //  this.objAfil.fecnac = this.model1.singleDate.jsDate;
    //  this.fecnac = formatDate(this.objAfil.fecnac, "yyyy-MM-dd","en-US");
  }

  // onChangeFecinipago(modelito) {
  //   this.model2 = modelito;
  //   this.objNucleo.fecinipago = this.model2.singleDate.jsDate;
  //   this.fecinipago = formatDate(this.objNucleo.fecinipago, "yyyy-MM-dd","en-US");
  // }

  creoAfiliado(f: NgForm) {
    let taok: boolean = this.valido();
    if (!taok) {
      return;
    }
    if (this.nivel === 90) {
      this.objAfil.status = this.status[this.elstat].slice(0, 1);
    }

    if (this.foto != null) {
      let reader = new FileReader();
      let fileByteArray = [];
      reader.readAsArrayBuffer(this.foto);
      reader.onload = (evt) => {
        let arrayBuffer = <ArrayBuffer>reader.result;
        let array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
          fileByteArray.push(array[i]);
        }
        this.objAfil.fichaimg = [];
        this.objAfil.fichaimg = fileByteArray;
        this.grabo();
      }
    } else {
      this.grabo();
    };
    return;
  }

  Aprobar() {
    let taok: boolean = this.valido();
    if (!taok) {
      return;
    }
    this.objAfil.status = 'A';
    this.grabo();
    return;
  }

  Terminar() {
    let taok: boolean = this.valido();
    if (!taok) {
      return;
    }
    this.objAfil.status = 'T';
    this.objAfil.feculting = new Date();
    this.objAfil.enable = true;
    this.grabo();
    return;
  }

  Rechazar() {
    this.objAfil.status = 'R';
    this.objAfil.feculbaja = new Date();
    this.objAfil.enable = false;
    this.grabo();
    return;
  }

  Condicionar() {
    let taok: boolean = this.valido();
    if (!taok) {
      return;
    }
    if (this.objAfil.notas == null || this.objAfil.notas.trim() === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar el motivo en las notas';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });

    } else {
      this.objAfil.status = 'C';
      this.grabo();
    }
  }

  grabo() {
    if (this.laLoca.id === 0) {
      this.objAfil.loc = null;
    } else {
      this.objAfil.loc = this.laLoca;
    }
    this.objAfil.ciudad = this.laCiud;
    this.objAfil.composicion = this.forma[this.laforma];
    this.objAfil.cargo = this.elCargo;
    if (this.objAfil.cargo.id === 0) {
      this.objAfil.cargo = null;
    }
    this.objFinal.afiliado = this.objAfil;
    this.objFinal.listanuc = this.listanuc;

    this.afisrv.saveAfiliado(this.objFinal).subscribe(
      resul => {
        for (const nunu of this.listanuc) {
          this.nucsrv.getNucleo(nunu.nucleo.id.toString()).subscribe(
            resnuget => {
              this.objNucleo = resnuget;
              if (nunu.del1) {
                this.objNucleo.delegado1 = parseInt(this.objAfil.cedula, 10);
              } else {
                if (this.objNucleo.delegado1 === parseInt(this.objAfil.cedula, 10)) {
                  this.objNucleo.delegado1 = null;
                }
              }
              if (nunu.del2) {
                this.objNucleo.delegado2 = parseInt(this.objAfil.cedula, 10);
              } else {
                if (this.objNucleo.delegado2 === parseInt(this.objAfil.cedula, 10)) {
                  this.objNucleo.delegado2 = null;
                }
              }
              if (this.objNucleo.delegado1 != null &&
                this.objNucleo.delegado2 != null &&
                this.objNucleo.delegado1 === this.objNucleo.delegado2) {
                this.objNucleo.delegado2 = null;
              }
              this.nucsrv.saveNucleo(this.objNucleo).subscribe();
            }
          );

        }

        this.swaltit = 'Ok';
        this.swalmsg = 'Afiliada/o fue actualizada/o correctamente';
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

  valido() {
    let okval = true;
    let txtval = '';
    if (this.objAfil.nombres == null || this.objAfil.nombres === '') {
      txtval = txtval.trim() + '[Debe ingresar al menos un nombre]';
      okval = false;
    }
    if (this.objAfil.apellidos == null || this.objAfil.apellidos === '') {
      txtval = txtval.trim() + '[Debe ingresar sus apellidos]';
      okval = false;
    }
    // if (this.laCiud == null || this.laCiud === undefined) {
    //   txtval = txtval.trim() + '[Debe ingresar la ciudad]';
    //   okval = false;
    // }

    // if (this.objAfil.fecnac == null || this.objAfil.fecnac === undefined) {
    //   txtval = txtval.trim() + '[Debe ingresar la fecha de nacimiento]';
    //   okval = false;
    // }
    // if (this.objAfil.sexo !== 'M' && this.objAfil.sexo !== 'F') {
    //   txtval = txtval.trim() + '[Debe ingresar su sexo para fines estadísticos]';
    //   okval = false;
    // }
    // if (this.elCargo == null || this.elCargo === undefined || this.elCargo.id === 0) {
    //   txtval = txtval.trim() + '[Debe ingresar el cargo que desempeña]';
    //   okval = false;
    // }
    if (!okval) {
      this.swaltit = 'Atención';
      this.swalmsg = txtval;
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return okval;
    } else {
      return okval;
    }
  }

  cambioId(mellega: string) {
    this.idAfil = mellega;
    let reg = new RegExp('^[+-]?(([0-9])?[0-9]+)$');
    let flag = reg.test(mellega);
    this.swaltit = 'Atención';
    this.swalmsg = 'No parece una cedula valida';
    console.log(flag);
    if (flag && mellega.length == 8) {
      if (this.lopido) {
        // @todo valido que sean numeros
        if (this.idAfil === undefined ||
          this.idAfil === null ||
          this.idAfil.trim() === '') {
          this.swaltit = 'Atención';
          this.swalmsg = 'La cédula no puede ser vacía';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
          return;
        }
        if (!this.afisrv.isValidCi(this.idAfil.toString())) {
          this.swaltit = 'Atención';
          this.swalmsg = 'No parece una cedula valida';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        }
  
        // Lo busco y sino lo creo
        this.getAfiliado();
        this.lopido = false;
      }
      
    } else {
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }


  reabro() {
    this.lopido = true;
  }

  volver() {
    this._location.back();
  }

  processFile(event: any) {
    this.foto = event.target.files[0];
    this.preview();
  }

  preview() {
    let reader = new FileReader();
    reader.readAsDataURL(this.foto);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
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

  onChangeCargo(elCargo) {
    this.elCargo = this.varsCargo[0]; // le pongo uno a prepo y despues lo busco
    for (const cargo of this.varsCargo) {
      if (elCargo.trim() === cargo.nombre.trim()) {
        this.elCargo = cargo;
        break;
      }
    }
  }

  onChangeFC(lafoca) {
    for (let i = 0; i < this.forma.length; i++) {
      if (lafoca.trim() === this.forma[i].trim()) {
        this.laforma = i;
        break;
      }
    }
  }

  onChangeStat(lastufa) {
    let mitufa: string;
    mitufa = lastufa;

    for (let i = 0; i < this.status.length; i++) {
      if (mitufa.slice(0, 1) === this.status[i].slice(0, 1)) {
        this.elstat = i;
        break;
      }
    }
  }

  onChangeTipo(lepotie) {
    let mipotie: string;
    mipotie = lepotie;

    for (let i = 0; i < this.status.length; i++) {
      if (mipotie.slice(0, 1) === this.tipo[i].slice(0, 1)) {
        this.eltipo = i;
        break;
      }
    }
  }


  get today() {
    return new Date();
  }

  nuc_cotizar(elid) {
    if (this.listanuc[elid].cotizante) {
      this.listanuc[elid].cotizante = false;
    } else {
      this.listanuc[elid].cotizante = true;
    }
    this.getCargo();
  }

  nuc_del1(elid) {
    if (this.listanuc[elid].del1) {
      this.listanuc[elid].del1 = false;
    } else {
      if (this.listanuc[elid].nucleo.delegado1 != null && this.listanuc[elid].nucleo.delegado1 !== 0) {
        if (this.listanuc[elid].nucleo.delegado1.toString().trim() === this.idAfil.trim()) {
          this.listanuc[elid].del1 = true;
        } else {
          this.swaltit = 'Atención';
          this.swalmsg = 'El delegado ya esta definido ...';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      } else {
        this.listanuc[elid].del1 = true;
      }
    }
    if (this.listanuc[elid].del1) {
      this.listanuc[elid].del2 = false;
    }
    this.getCargo();
  }

  nuc_del2(elid) {
    if (this.listanuc[elid].del2) {
      this.listanuc[elid].del2 = false;
    } else {
      if (this.listanuc[elid].nucleo.delegado2 != null && this.listanuc[elid].nucleo.delegado2 !== 0) {
        if (this.listanuc[elid].nucleo.delegado2.toString().trim() === this.idAfil.trim()) {
          this.listanuc[elid].del2 = true;
        } else {
          this.swaltit = 'Atención';
          this.swalmsg = 'El delegado ya esta definido ...';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      } else {
        this.listanuc[elid].del2 = true;
      }
    }
    if (this.listanuc[elid].del2) {
      this.listanuc[elid].del1 = false;
    }
    this.getCargo();
  }

  nuc_lab(elid) {
    if (this.listanuc[elid].lab) {
      this.listanuc[elid].lab = false;
    } else {
      this.listanuc[elid].lab = true;
    }
    this.getDelegados();
  }

  nuc_borrar(elid) {
    let j = 0;
    j = elid;
    let otralista: AfilNucleo[];
    otralista = this.listanuc;
    this.listanuc = [];
    for (let i = 0; i < otralista.length; i++) {
      if (i !== j) {
        this.listanuc.push(otralista[i]);
      }
    }
    this.getCargo();
  }

  nuc_open(content) {
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
    let miNucleo = new Nucleo();
    miNucleo = elitem;
    let esta = false;

    for (const afinu of this.listanuc) {
      if (afinu.nucleo.id === miNucleo.id) {
        esta = true;
        this.modalService.dismissAll();
        return;
      }
    }
    if (!esta) {
      this.adentro(miNucleo);
    }
    this.modalService.dismissAll();
    this.getCargo();
  }

  adentro(unNucleo) {
    let mifinu = new AfilNucleo();
    mifinu.nucleo = unNucleo;
    mifinu.afiliado = this.objAfil;
    mifinu.cotizante = false;
    if (this.listanuc.length === 0) {
      mifinu.cotizante = true;
    }
    mifinu.del1 = false;
    mifinu.del2 = false;
    mifinu.lab = false;
    this.listanuc.push(mifinu);
  }


  /////// ------------------ Para el alta de ciudades y localidades
  openCiud(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  elijoCiudad() {
    this.ciusrv.getCiudades().subscribe(
      resci => {
        this.varsCiud = resci;
        this.objAfil.ciudad = this.objCiudad;
        this.laCiud = this.objCiudad;
        this.objAfil.loc = null;
        this.cargoLoc();
      }
    );
    this.modalService.dismissAll();
  }

  openLoc(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  elijoLoc() {
    this.objAfil.loc = this.objLoc;
    this.cargoLoc();
    this.modalService.dismissAll();
  }

  closeCiud() {
    this.modalService.dismissAll();
  }


  // -------------------- Listado de excel
  ExcelLog() {

    this.listalog = [];
    this.perfsrv.getLogs('A', this.idAfil.toString()).subscribe(
      reslog => {
        this.listalog = reslog;
        this.ExportoLog();
      }
    );
  }

  ExportoLog() {
    const lisXls = [];
    for (let i = 0; i < this.listalog.length; i++) {
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
    const pTit = 'Listado de actividad';
    const pSubtit = 'Cédula: ' + this.objAfil.cedula + ' ' + this.objAfil.apellidos + ' ' + this.objAfil.nombres;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

}
