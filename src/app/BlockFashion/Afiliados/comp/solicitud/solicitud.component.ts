import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { NgbDateAdapter, NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Afiliado } from '../../models/afiliado';
import { Cargo } from '../../../Admin/models/cargo';
import { Ciudad } from '../../../Admin/models/ciudad';
import { Localidad } from '../../../Admin/models/localidad';
import { AfilNucleo } from '../../models/afilnuc';
import { Nucleo } from '../../models/nucleo';
import { AfilDto } from '../../models/afildto';
import { Dato } from '../../../Admin/models/dato';
import { Log } from '../../../Admin/models/log';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AfiliadosService } from '../../serv/afiliados.service';
import { formatDate } from '@angular/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfSolicitudService } from '../../serv/pdf-solicitud.service';


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
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})

export class SolicitudComponent implements OnInit, OnDestroy {

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
  forma = ['a) Jefa de hogar', 'b) Niños a cargo', 'c) Adultos mayores a cargo', 'd) Discapacitados a cargo', 'e) Otros']
  laforma = 4;
  status = ['Iniciada', 'Aprobada', 'Terminada', 'Rechazada']
  elstat = 0;
  tipo = ['Afiliado', 'Fundador', 'Otro']
  eltipo = 0;
  listanuc: AfilNucleo[];
  nucleos: Nucleo[];
  closeResult = '';
  objFinal = new AfilDto();
  objCiudad: Ciudad;
  objLoc: Localidad;
  objDato: Dato;
  listalog: Log[];
  fechoy = '';
  isAfil: boolean = false;

  constructor(private router: Router,
    private afisrv: AfiliadosService,
    private pdfsrv: PdfSolicitudService,
    private modalService: NgbModal,
    private _activeRouter: ActivatedRoute) {
    this.pageSettings.pageEmpty = true;

  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {

    //get params to check if exist afil(1) or not (0)


    this.fechoy = formatDate(new Date(), 'dd / MM / yyyy', "en-US");
    this.varsCiud = [];
    this.varsLoc = [];
    this.varsCargo = [];
    this.nucleos = [];
    this.listanuc = [];
    this.lopido = true;
    this.inicio_afiliado();


    this.afisrv.getNucDTO().subscribe(
      resnuc => {
        if (resnuc !== undefined) {
          this.nucleos = resnuc;
        }
      }
    );
  }
  getParams() {
    this._activeRouter.paramMap.subscribe(res => {
      if (res.has("id")) {
        let id = res.get("id");
        switch (id) {
          case "0":
            this.isAfil = false;

            break;
          case "1":
            this.isAfil = true;
            this.objAfil.notas = "LA PERSONA YA ESTA AFILIADA A SINTEP";
            break;

          default:
            break;
        }
      }
    })
  }

  inicio_afiliado() {
    this.listanuc = [];
    this.objAfil = new Afiliado();
    this.objAfil.cedula = this.idAfil;
    this.laCiud = this.varsCiud[0];
    this.elCargo = this.varsCargo[0];
    this.laforma = 0;
    this.elstat = 0;
    this.eltipo = 0;
    this.objAfil.fecsoling = new Date();
    this.getParams();

  }

  creoAfiliado(f: NgForm) {

    let okval: boolean = this.valido();
    if (!okval) {
      return
    }

    this.objAfil.loc = null;
    this.objAfil.ciudad = null;
    this.objAfil.composicion = this.forma[this.laforma];
    this.objAfil.cargo = null;
    this.objFinal.afiliado = this.objAfil;
    this.objFinal.listanuc = this.listanuc;
    this.afisrv.solicitud(this.objFinal).subscribe(
      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'Afiliada/o fue actualizada/o correctamente - Debe imprimir esta ficha luego de confirmarla y descrgarla; firmarla y enviarla escaneada o en una foto por mail; o llevarla personalmente al delegado o a SINTEP';
        // this.swalmsg = this.objDato.textoficha;
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.volver();
        // maaaaaaa y aca que hago! me voy a sintep

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
    let okval: boolean = true;
    let txtval = '';
    if (this.objAfil.nombres == null || this.objAfil.nombres === '') {
      txtval = txtval.trim() + '[Debe ingresar al menos un nombre]';
      okval = false;
    }
    if (this.objAfil.apellidos == null || this.objAfil.apellidos === '') {
      txtval = txtval.trim() + '[Debe ingresar sus apellidos]';
      okval = false;
    }
    if (this.objAfil.txtciudad == null || this.objAfil.txtciudad === '') {
      txtval = txtval.trim() + '[Debe ingresar la ciudad]';
      okval = false;
    }
    if (this.objAfil.txtlocalidad == null || this.objAfil.txtlocalidad === '') {
      txtval = txtval.trim() + '[Debe ingresar la localidad]';
      okval = false;
    }
    if (this.objAfil.fecnac == null || this.objAfil.fecnac === undefined) {
      txtval = txtval.trim() + '[Debe ingresar la fecha de nacimiento]';
      okval = false;
    }
    if (this.objAfil.sexo !== 'M' && this.objAfil.sexo !== 'F') {
      txtval = txtval.trim() + '[Debe ingresar su sexo para fines estadísticos]';
      okval = false;
    }
    if (this.objAfil.txtcargo == null || this.objAfil.txtcargo === '') {
      txtval = txtval.trim() + '[Debe ingresar el cargo que desempeña]';
      okval = false;
    }
    if (this.objAfil.txtdepto == null || this.objAfil.txtdepto === '') {
      txtval = txtval.trim() + '[Debe ingresar el departamento] ';
      okval = false;
    }
    if (this.listanuc.length !== 1) {
      txtval = txtval.trim() + '[Debe ingresar el nucleo/institución por la que se afilia]';
      okval = false;
    }
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
      Swal.fire({
        title: "Exito",
        text: "Los datos son correctos",
        type: 'info',
        confirmButtonText: 'OK',
      });
      return okval;
    }
  }

  cambioId(mellega) {
    this.idAfil = mellega;
    let reg = new RegExp('^[+-]?(([0-9])?[0-9]+)$');
    let flag = reg.test(mellega);
    this.swaltit = 'Atención';
    this.swalmsg = 'No parece una cedula valida';
    if (flag && mellega.length == 8) {
      if (this.lopido) {
        //@todo valido que sean numeros
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
        this.afisrv.isAfiliado(this.idAfil.toString()).subscribe(
          resaf => {
            if (resaf !== undefined && resaf === true) {
              this.swaltit = 'Atención';
              this.swalmsg = 'Ya figura como afiliado en el padrón .. consulte';
              Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'warning',
                confirmButtonText: 'OK',
              });
              return;
            } else {
              this.inicio_afiliado();
              this.lopido = false;
            }
          }, error => {
            this.inicio_afiliado();
            this.lopido = false;
          }
        );

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


  onChangeFC(lafoca) {
    for (let i = 0; i < this.forma.length; i++) {
      if (lafoca.trim() === this.forma[i].trim()) {
        this.laforma = i;
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
    this.listanuc.push(mifinu);
  }

  generatePdf() {

    this.pdfsrv.generatePdf(this.objAfil);
  }


  volver() {
    window.location.href = 'http://www.sintep.org.uy/';
  }
}

