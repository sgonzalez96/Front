import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Evento } from '../../models/evento';
import { TipoAct } from '../../models/tipoact';
import { Usuario } from '../../../Admin/models/usuario';
import { EventosService } from '../../serv/eventos.service';
import { ActivatedRoute } from '@angular/router';
import pageSettings from '../../../../config/page-settings';
import { TipoactService } from '../../serv/tipoact.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { Location } from '@angular/common';
import { Invitacion } from '../../models/invitacion';
import { NgForm } from '@angular/forms';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import Swal from 'sweetalert2';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { InvResDTO } from '../../models/invresdto';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Dato } from '../../../Admin/models/dato';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Ciudad } from '../../../Admin/models/ciudad';
import { InvDTO } from '../../models/invdto';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { Nucleo } from '../../../Afiliados/models/nucleo';

@Component({
  selector: 'app-eve-manager',
  templateUrl: './eve-manager.component.html',
  styleUrls: ['./eve-manager.component.css']
})
export class EveManagerComponent implements OnInit, OnDestroy {
  @ViewChild('opciones', null) elcombo: ElementRef;

  pageSettings = pageSettings;
  objEve = new Evento();
  objAfil = new Afiliado();
  swaltit: string;
  swalmsg: string;
  swaldos: string;

  varsStat = ['Todos', 'En Lista', 'Enviada', 'Inscripta', 'Rechazada', 'Asiste', 'Falta'];
  varsAccion = ['-------------------', 'Quitar de la lista', 'Exportar seleccionados', 'Cambiar estado', 'Cambiar costos'];
  elStat = '';
  laAcc = '';
  elusu: Usuario;
  listatot: Invitacion[];
  lista: invitacionDto[];
  lisinv: Invitacion[];

  pido_ci = false;
  modo_ci = '';
  idAfil = '';
  habsub = false;
  objInv: Invitacion = new Invitacion();

  pido_csv = false;
  public records: any[] = [];
  @ViewChild('csvReader', null) csvReader: any;
  listaDTO: InvResDTO[];
  resultado = false;
  closeResult = '';
  porc_err = 0;
  porc_ok = 0;
  porc_war = 0;
  cant_err = 0;
  cant_war = 0;
  cant_ok = 0;

  cedini = '00000000';
  cedfin = '99999999';
  nucini = '000000';
  nucfin = '999999';

  afiIni: Afiliado = new Afiliado();
  afifin: Afiliado = new Afiliado();

  cedinidsc = '';
  cedfindsc = '';
  nucinidsc = '';
  nucfindsc = '';
  van_afi = true;
  van_del = true;
  van_delab = true;
  van_usu = true;
  rolini = 0;
  rolfin = 90;


  todos = false;
  soloconcosto = false;
  elcosto = false;
  haysel = false;

  lisXls = [];
  objDato: Dato;

  disp_cam = false;
  varsEst = ['En Lista', 'Enviada', 'Inscripta', 'Rechazada', 'Asiste', 'Falta'];
  elEst = '';

  objCiud: Ciudad;
  disp_costo = false;
  elCosto = '';
  varsCostoEst = ['-------', 'Calcular', 'Definido', 'Aprobado', 'Ya pago'];
  elstatcos = '';

  constructor(private evesrv: EventosService,
    private actRout: ActivatedRoute,
    private afisrv: AfiliadosService,
    private nucsrv: NucleosService,
    private modalService: NgbModal,
    private excsrv: ExceljsService,
    private datsrv: DatosService,
    private logsrv: LoginService,
    private _location: Location) {

  }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.cedini = '00000000';
    this.cedfin = '99999999';
    this.nucini = '000000';
    this.nucfin = '999999';
    this.rolini = 0;
    this.rolfin = 90;

    this.lista = [];
    this.listatot = [];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.elStat = this.varsStat[0];
    this.laAcc = this.varsAccion[0];
    this.elEst = this.varsEst[0];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.actRout.paramMap.subscribe(
      params => {
        let idEve = params.get('id');
        this.evesrv.getEvento(idEve).subscribe(
          resu => {
            this.objEve = resu;
            this.recargo();
          }
        );
      }
    );
  }

  //modal get afiini
  openAfiini(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: result`;
    }, (reason: Afiliado) => {
      console.log(reason);
      this.cedini = reason.cedula;
      this.cedinidsc = reason.nombres + reason.apellidos;
    });
  }
  // modal get afifin
  openAfifin(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: result`;
    }, (reason: Afiliado) => {
      console.log(reason);
      this.cedfin = reason.cedula;
      this.cedfindsc = reason.nombres + reason.apellidos;
    });
  }
  // modal get afiIni
  openNucleoIni(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: result`;
    }, (reason: Nucleo) => {
      console.log(reason);
      this.nucini = reason.id.toString();
      this.nucinidsc = reason.nombre;
    });
  }
  // modal get afiFin
  openNucleoFin(content) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: result`;
    }, (reason: Nucleo) => {
      console.log(reason);
      this.nucfin = reason.id.toString();
      this.nucfindsc = reason.nombre;
    });
  }





  recargo() {
    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.listatot = [];
    this.evesrv.getInvitaciones(this.objEve.id.toString()).subscribe(
      resinv => {
        if (resinv != undefined) {
          this.listatot = resinv;
          this.filtro();
          Swal.close();
        }
      }
    );

  }

  filtro() {
    this.lista = [];
    for (const lili of this.listatot) {
      let estava = true;
      if (this.elStat.trim() !== 'Todos') {
        if (this.elStat.trim() !== lili.status.trim()) {
          estava = false;
        }
      }
      if (estava) {
        if (this.soloconcosto) {
          if (lili.costo === 0) {
            estava = false;
          }
        }
      }
      if (estava) {
        let invDto = new invitacionDto();
        invDto.inv = lili;
        invDto.sel = false;
        this.lista.push(invDto);
      }
    }
  }

  onChange(mistat) {
    for (const stat of this.varsStat) {
      if (mistat.trim() == stat.trim()) {
        this.elStat = mistat;
        this.filtro();
        break;
      }
    }
  }

  cambio_costo() {
    if (this.elcosto) {
      this.soloconcosto = false;
    } else {
      this.soloconcosto = true;
    }
    this.filtro();
  }

  onChangeAcc(miacc) {
    this.apago();
    this.reset_accion();
    if (miacc.trim() !== this.varsAccion[0].trim()) {
      if (this.estavacia()) {
        this.swaltit = 'Atención';
        this.swalmsg = 'No hay lineas seleccionadas';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK',
        });


      } else if (miacc.trim() === this.varsAccion[1].trim()) {
        this.losborro();
      } else if (miacc.trim() === this.varsAccion[2].trim()) {
        this.exportExcel('P');
      } else if (miacc.trim() === this.varsAccion[3].trim()) {
        this.cambioEstado();
      } else if (miacc.trim() === this.varsAccion[4].trim()) {
        this.cambioCosto();
      }
    }
  }

  apago() {
    this.pido_csv = false;
    this.pido_ci = false;
    this.habsub = false;
    this.resultado = false;
    this.disp_cam = false;
    this.disp_costo = false;

  }


  cambioId(mellega) {
    this.idAfil = mellega;
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
    this.afisrv.getAfiliado(this.idAfil.trim()).subscribe(
      resafi => {
        if (resafi != null && resafi != undefined) {
          this.objAfil = resafi;
          this.evesrv.getInvitado(this.objEve.id.toString(), this.idAfil.trim()).subscribe(
            yata => {
              console.log(yata);
              if (this.modo_ci == 'I') {
                if (yata == null || yata === undefined || yata.afiliado == null) {
                  this.habsub = true;
                } else {
                  this.swaltit = 'Atención';
                  this.swalmsg = 'La cédula ya esta en el evento ' + yata.status;
                  Swal.fire({
                    title: this.swaltit,
                    text: this.swalmsg,
                    type: 'warning',
                    confirmButtonText: 'OK',
                  });
                }
              } else {
                //modo 'A' de asistencia .. te mando al fondo de a red!!
                console.log("vamos ");
                this.objInv = yata;
                this.agrego_asiste();
              }
            }
          );
        } else {
          this.swaltit = 'Atención';
          this.swalmsg = 'Cédula inexistente en el padrón';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
            confirmButtonText: 'OK',
          });
        }

      }, error => {
        this.habsub = false;
        this.swaltit = 'Atención';
        this.swalmsg = 'Error al leer la cédula';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }



  agrego_asiste() {
    this.objInv.fecult = new Date();
    this.objInv.status = 'Asiste';
    this.objInv.asistio = true;

    let invidto: InvDTO = new InvDTO();
    invidto.invitacion = this.objInv;
    invidto.textolog = 'Asistencia por manager de eventos';
    invidto.usuId = this.elusu.idUser;

    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.evesrv.saveInvitacion(invidto).subscribe(
      resinv => {
        this.recargo();
        this.objAfil = new Afiliado();
        this.idAfil = '';
        Swal.close();
      }, error => {
        Swal.close();
        this.swaltit = 'Atención';
        this.swalmsg = 'Error al grabar la asistencia ';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
          confirmButtonText: 'OK',
        });

      }
    );
  }

  cierro_ci() {
    this.apago();
  }

  // ---------------------------- Manejo de la importacion de CSV
  pido_archivo() {
    this.apago();
    this.pido_csv = true;
  }

  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
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
      console.log(curruntRecord.length);
      if (curruntRecord.length >= 1) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.id = curruntRecord[0].trim();
        if (csvRecord.id.trim() != '') {
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
    this.lisinv = [];
    for (const lalo of this.records) {
      let lalin: Invitacion = new Invitacion();
      lalin.evento = this.objEve;
      lalin.cedula = lalo.id;
      lalin.afiliado = null;
      lalin.fecult = new Date();
      lalin.status = this.varsStat[1];
      lalin.costo = 0;
      lalin.costostat = '';
      this.lisinv.push(lalin);
    }
    this.listaDTO = [];
    this.cant_err = 0;
    this.cant_ok = 0;
    this.cant_war = 0;
    this.porc_err = 0;
    this.porc_ok = 0;
    this.porc_war = 0;
    this.listaDTO = [];
    this.evesrv.saveInvitaciones(this.lisinv, "A", "Invitación por CSV",
      this.elusu.idUser.toString()).subscribe(
        resinv => {
          if (resinv.length > 0) {
            this.listaDTO = resinv;
            this.proceso_res();
          }
        }
      );
    this.pido_csv = false;
  }

  proceso_res() {
    this.cant_err = 0;
    this.cant_ok = 0;
    this.cant_war = 0;
    this.porc_err = 0;
    this.porc_ok = 0;
    this.porc_war = 0;
    this.resultado = true;
    for (const undto of this.listaDTO) {
      if (undto.resultado.substr(0, 5) === 'Error') {
        this.cant_err = this.cant_err + 1;
      } else if ((undto.resultado.substr(0, 5) === 'Exito')) {
        this.cant_ok = this.cant_ok + 1;
      } else {
        this.cant_war = this.cant_war + 1;
      }
    }
    this.porc_err = (this.cant_err * 100) / this.listaDTO.length;
    this.porc_err = Math.round(this.porc_err * 100) / 100;
    this.porc_ok = (this.cant_ok * 100) / this.listaDTO.length;
    this.porc_ok = Math.round(this.porc_ok * 100) / 100;
    this.porc_war = (this.cant_war * 100) / this.listaDTO.length;
    this.porc_war = Math.round(this.porc_war * 100) / 100;
    this.recargo();
  }

  cierro_csv() {
    this.apago();
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

  cierro_res() {
    this.apago();
  }

  //------------------------ Operaciones con la grilla seleccionada -----------------\\
  losborro() {
    this.swaltit = '¿Desea quitar de la lista las lineas seleccionadas?';
    this.swalmsg = '';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro();
      }
    });
  }

  teborro() {
    this.lisinv = [];
    this.listaDTO = [];
    for (const invi of this.lista) {
      if (invi.sel) {
        this.lisinv.push(invi.inv);
      }
    }
    this.evesrv.saveInvitaciones(this.lisinv, 'B', 'Baja de invitaciones', this.elusu.idUser.toString()).subscribe(
      resinvbo => {
        if (resinvbo.length > 0) {
          this.listaDTO = resinvbo;
          this.proceso_res();
        }
      }
    );
  }

  estavacia() {
    let vacia = true;
    for (const toto of this.lista) {
      if (toto.sel) {
        vacia = false;
        return vacia;
      }
    }
    return vacia;
  }

  exportExcel(modito) {
    this.lisXls = [];
    console.log(modito);
    if (modito.trim() === 'T') {
      for (let i = 0; i < this.listatot.length; i++) {
        this.preparo_xls(this.listatot[i]);
      }
    } else {
      for (let i = 0; i < this.lista.length; i++) {
        if (this.lista[i].sel) {
          this.preparo_xls(this.lista[i].inv);
        }
      }
    }

    const pHeader = ["Cedula", "Apellidos", "Nombres", "Status", "Costo", "StCos", "Email", "Direccion", "Departamento", "Ciudad"
      , "Localidad", "Telefono", "Celular", "Sexo", "Fec.Nac.", "Composicion", "Cargo", "Ing.Inst.",
      "Ing.Sector", "En publico", "Ficha papel", "Ficha img.", "Activo", "Status", "Tipo", "Fec.Sol.", "FecUltIng", "FecUltBaja",
      "Status", "Ultimo Stat", "Evaluacion", "Calificacion", "Costo", "StatusCosto"];
    const pCol = [10, 25, 25, 15, 10, 10, 40, 40, 20, 20,
      20, 20, 20, 5, 10, 15, 20, 10,
      10, 15, 15, 15, 15, 15, 15, 10, 10, 10,
      25, 15, 40, 5, 10, 15, 20];
    const pTit = 'Listado de Invitados al evento';
    const pSubtit = 'Evento: ' + this.objEve.nombre + '/' + this.objEve.tipoact.descripcion;
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, this.lisXls, [],
      [], [], [],
      {}
    );
  }

  preparo_xls(invitacion) {
    let elmio: Invitacion;
    elmio = invitacion;

    let locname = '';

    if (elmio.afiliado.loc != null && elmio.afiliado.loc !== undefined) {
      locname = elmio.afiliado.loc.nombre;
    }
    let ciuname = '';
    let depname = '';
    if (elmio.afiliado.ciudad != null && elmio.afiliado.ciudad !== undefined) {
      ciuname = elmio.afiliado.ciudad.nombre;
      depname = elmio.afiliado.ciudad.dep.nombre;
    }
    let fichaenimagen = false;
    if (elmio.afiliado.loc != null) {
      fichaenimagen = true;
    }
    this.lisXls.push([
      elmio.afiliado.cedula,
      elmio.afiliado.apellidos,
      elmio.afiliado.nombres,
      elmio.status,
      elmio.costo,
      elmio.costostat,
      elmio.afiliado.email,
      elmio.afiliado.direccion,
      depname,
      ciuname,
      locname,
      elmio.afiliado.telefonos,
      elmio.afiliado.celular,
      elmio.afiliado.sexo,
      elmio.afiliado.fecnac,
      elmio.afiliado.composicion,
      elmio.afiliado.cargo != null ? elmio.afiliado.cargo.nombre : "",
      elmio.afiliado.anioinginst,
      elmio.afiliado.anioinginst,
      elmio.afiliado.publico,
      elmio.afiliado.fichapapel,
      fichaenimagen,
      elmio.afiliado.enable,
      elmio.afiliado.status,
      elmio.afiliado.tipo,
      elmio.afiliado.fecsoling,
      elmio.afiliado.feculting,
      elmio.afiliado.feculbaja,
      elmio.status,
      elmio.fecult != null ? elmio.fecult.toString().slice(0,10) :"",
      elmio.evalnota,
      elmio.rating,
      elmio.costo,
      elmio.costostat
    ]);
  }

  volver() {
    this._location.back();
  }


  cambio_todo() {
    this.haysel = false;
    for (let i = 0; i < this.lista.length; i++) {
      if (this.todos) {
        this.lista[i].sel = false;
      } else {
        this.lista[i].sel = true;
        this.haysel = true;
      }
    }
  }

  // ------------------- Para el cambio de estado ------------------------------------
  cambioEstado() {
    this.apago();
    this.disp_cam = true;
  }

  cierro_est() {
    this.apago();
  }

  onChangeEst(mistat) {
    for (const stat of this.varsEst) {
      if (mistat.trim() === stat.trim()) {
        this.elEst = mistat;
        break;
      }
    }
  }

  cambio_est(f: NgForm) {
    this.lisinv = [];
    this.listaDTO = [];
    for (let invi of this.lista) {
      if (invi.sel) {
        invi.inv.status = this.elEst;
        this.lisinv.push(invi.inv);
      }
    }
    this.evesrv.saveInvitaciones(this.lisinv, 'M', 'Cambio de estado a ' +
      this.elEst, this.elusu.idUser.toString()).subscribe(
        resinvbo => {
          if (resinvbo.length > 0) {
            this.listaDTO = resinvbo;
            this.disp_cam = false;
            this.proceso_res();
          }
        }
      );
  }

  reset_accion() {
    this.laAcc = this.varsAccion[0];
    this.elcombo.nativeElement.value = this.laAcc;
  }


  // ------------------- Para el cambio de estado ------------------------------------
  cambioCosto() {
    this.apago();
    this.elCosto = '';
    this.elstatcos = this.varsCostoEst[0];
    this.disp_costo = true;
  }

  cierro_costo() {
    this.apago();
  }

  onChangeCostostat(mistat) {
    this.elstatcos = mistat;
  }

  cambio_costo_final(f: NgForm) {
    console.log("me llega " + this.elcosto);
    this.lisinv = [];
    this.listaDTO = [];
    for (let invi of this.lista) {
      console.log("una invitacion ");
      console.log(invi);
      if (invi.sel) {
        if (this.elCosto.trim() !== '') {
          invi.inv.costo = parseInt(this.elCosto, 10);
        }
        if (this.elstatcos.trim() != this.varsCostoEst[0]) {
          if (this.elstatcos.trim() === this.varsCostoEst[1]) {
            invi.inv.costostat = '';  //que lo calcule
            invi.inv.costo = 0;
          }
          if (this.elstatcos.trim() === this.varsCostoEst[2].trim()) {
            invi.inv.costostat = 'D';  //Definido
          }
          if (this.elstatcos.trim() === this.varsCostoEst[3].trim()) {
            invi.inv.costostat = 'C';  //Confirmado
          }
          if (this.elstatcos.trim() === this.varsCostoEst[4].trim()) {
            invi.inv.costostat = 'P';  //Pago
          }
        }

        this.lisinv.push(invi.inv);
      }
    }
    this.evesrv.saveInvitaciones(this.lisinv, 'M', 'Cambios en el costo ' + this.elcosto + ' - ' + this.elstatcos,
      this.elusu.idUser.toString()).subscribe(
        resinvbo => {
          this.recargo();
          this.cierro_costo();
        }
      );
  }



  // -------------- para el boton de ver afiliado
  openAfil(content, elafi) {
    this.objAfil = elafi;
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  agrego_ci(f: NgForm) {
    Swal.fire({
      titleText:"Ejecutando",
      text: "Esta accion puede demorar unos minutos"
    });
    Swal.showLoading();
    if (this.cedini > this.cedfin || this.nucini > this.nucfin) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Rango de socios o núcleos incorrecto, final mayor a inicial';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return
    }

    this.modalService.dismissAll();
    this.objInv.afiliado = this.objAfil;
    this.objInv.evento = this.objEve;
    this.objInv.fecult = new Date();
    this.objInv.status = 'En Lista';
    this.objInv.costo = 0;
    this.objInv.costostat = '';

    const invidto: InvDTO = new InvDTO();
    invidto.invitacion = this.objInv;
    invidto.textolog = 'Agregado a la lista de invitados';
    invidto.usuId = this.elusu.idUser;
    invidto.cedini = this.cedini;
    invidto.cedfin = this.cedfin;
    invidto.nucini = this.nucini;
    invidto.nucfin = this.nucfin;
    invidto.delab = this.van_delab;
    invidto.roles = [];
    for (let i = this.rolini; i <= this.rolfin; i = i + 10) {
      console.log("la i " + i);
      if (i === 0) {
        if (this.van_afi) {
          invidto.roles.push(i);
        }
      } else if (i === 10) {
        if (this.van_del) {
          invidto.roles.push(i);
        }
      } else {
        if (this.van_usu) {
          invidto.roles.push(i);
        }
      }
    }
    // -- el rol 45 es secretrariado, son funcionarios en general siemrpe afiliados
    if (this.van_usu) {
      invidto.roles.push(45);
    }

    console.log("avanza ");
    console.log(invidto);
    
      this.evesrv.saveInvLote(invidto).subscribe(
        resinv => {
          console.log(resinv);
          if (resinv) {
            this.objAfil = new Afiliado();
            this.idAfil = '';
            this.recargo();
          }
          
        },err=>{
          console.log(err);
          Swal.fire("Error","No se pudo completar la accion","error");
        }
      );
    
    
  }

  // -------------- para invitados por loteeee el botn de Invitar
  pido_cedula(content, momito) {
    this.apago();
    this.objAfil = new Afiliado();
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cambio_cedIni(cedin) {
    this.afisrv.getAfiliado(cedin).subscribe(
      reasfi => {
        this.cedinidsc = reasfi.apellidos.trim() + ' ' + reasfi.nombres.trim();
        this.cedfin = this.cedini;
        this.cedfindsc = this.cedinidsc;
      }
    );
  }

  cambio_cedFin(cedfi) {
    this.afisrv.getAfiliado(cedfi).subscribe(
      reasfi => {
        this.cedfindsc = reasfi.apellidos.trim() + ' ' + reasfi.nombres.trim();
      }
    );
  }
  cambio_nucIni(nucin) {
    this.nucsrv.getNucleo(nucin).subscribe(
      resnuc => {
        this.nucinidsc = resnuc.nombre.trim();
        this.nucfin = this.nucini;
        this.nucfindsc = this.nucinidsc;
      }
    );
  }
  cambio_nucFin(nucfi) {
    this.nucsrv.getNucleo(nucfi).subscribe(
      resnuc => {
        this.nucfindsc = resnuc.nombre.trim();

      }
    );
  }

  closeAfil() {
    console.log("hace algooo papa");
    this.modalService.dismissAll();
  }


  // -------------- para el boton de costos de una ciudad
  openCosto(content) {
    this.objCiud = this.objEve.ciudad;
    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closeCosto() {
    this.modalService.dismissAll();
  }


}
/// ------------------ DTOs para el manejo de la pantalla -------------------- \\\

export class invitacionDto {
  inv: Invitacion;
  sel: boolean;
}

export class CSVRecord {
  public id: any;
}
