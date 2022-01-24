import { Component, OnInit, ViewChild } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Afiliado } from '../../models/afiliado';
import { Dato } from '../../../Admin/models/dato';
import { AfiliadosService } from '../../serv/afiliados.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AfilDto } from '../../models/afildto';
import { AfilNucleo } from '../../models/afilnuc';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { Nucleo } from '../../models/nucleo';
import { NucleosService } from '../../serv/nucleos.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfSolicitudService } from '../../serv/pdf-solicitud.service';
import { Table } from 'primeng/table';
import { EnvService } from '../../../Tools/serv/env.service';
import { DelegadosService } from '../../serv/delegados.service';

@Component({
  selector: 'app-afil-lista',
  templateUrl: './afil-lista.component.html',
  styleUrls: ['./afil-lista.component.css']
})
export class AfilListaComponent implements OnInit {
  @ViewChild('dt', null) dataTable: Table;


  pageSettings = pageSettings;
  lista_tot: Afiliado[];
  lista: Afiliado[];
  lista_fil: Afiliado[];
  lista_leo: Afiliado[];
  listanuc: AfilNucleo[];
  objAfi: Afiliado;
  objDato: Dato;

  varsFiltro = ['Activa/o', 'Inactivo/a', 'Todas y todos', 'Delegados'];
  idFiltro = 0;
  elfiltro = '';

  varsFicha = ['Fichas Pendientes', 'Fichas Finalizadas', 'Todas la fichas'];
  idFicha = 0;
  laficha = '';

  idNucleo = 0;
  elnucleo: Nucleo;
  varsNucleo: Nucleo[];


  buscar = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  closeResult = '';
  modobaja = '';



  nivel = 0;
  elusu: Usuario = new Usuario();
  listnucdel: AfilNucleo[]; //Lista de las cuales es delegado
  listafi: AfilNucleo[];    //Afiliados de cada nucleo que es delegado ...


  constructor(
    private afisrv: AfiliadosService,
    private _delegado: DelegadosService,
    private nucsrv: NucleosService,
    private modalService: NgbModal,
    private excsrv: ExceljsService,
    private logsrv: LoginService,
    private pdfsrv: PdfSolicitudService,
    private envsrv: EnvService,
    private datsrv: DatosService) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();
    if (this.nivel !== 50 && this.nivel !== 90) {
      this.afisrv.getNucAfiliado(this.elusu.afinro.toString().trim()).subscribe(
        resdele => {
          for (const dele of resdele) {
            if (dele.nucleo.delegado1 === this.elusu.afinro ||
              dele.nucleo.delegado2 === this.elusu.afinro) {
              this.nivel = 10;
              break;
            }
          }
        }
      );
    }

    this.lista = [];
    this.lista_tot = [];
    this.lista_fil = [];
    this.lista_leo = [];
    this.buscar = '';
    this.idFiltro = 2;
    this.elfiltro = this.varsFiltro[this.idFiltro];
    this.idFicha = 2;
    if (this.nivel === 50) {
      this.idFicha = 0;
    }

    this.laficha = this.varsFicha[this.idFicha];

    this.varsNucleo = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.nucsrv.getNucleos().subscribe(
      resnuc => {
        this.varsNucleo = resnuc;
        this.elnucleo = new Nucleo();
        this.elnucleo.id = 999999;
        this.elnucleo.nombre = 'Todos los nucleos';
        this.varsNucleo.push(this.elnucleo);
        this.idNucleo = this.varsNucleo.length - 1;
        this.armo_total();
      }
    );

  }

  // redireccion a nueva solicitud de afiliado segun deploy o produccion
  solicitudAfil() {
    window.open(this.envsrv.urlSolicitud, "_blank");
  }

  armo_total() {
    this.lista_tot = [];
    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();

    if (this.nivel === 10) {
      this.listafi = [];
      this.afisrv.getNucAfiliado(this.elusu.afinro.toString().trim()).subscribe(
        resdele => {

          for (const dele of resdele) {
            if (dele.nucleo.delegado1 === this.elusu.afinro ||
              dele.nucleo.delegado2 === this.elusu.afinro) {
              this.afisrv.getAfiNucleo(dele.nucleo.id.toString()).subscribe(
                resfafa => {
                  for (const fafa of resfafa) {
                    this.lista_tot.push(fafa.afiliado);
                  }
                  this.varsNucleo = [];
                  this.varsNucleo.push(dele.nucleo);
                  this.idNucleo = this.varsNucleo[0].id;
                  this.elnucleo = dele.nucleo;
                }
              );
              break;
            }
          }
          Swal.close();
          this.refiltro();
        }
      );
    } else {
      console.log("al tope");
      this.afisrv.getListaAfi().subscribe(
        resafi => {
          console.log(resafi);
          if (resafi !== undefined) {
            this.lista_tot = resafi;
            console.log("vamos");
            Swal.close();
            this.refiltro();
          }
        }
      );
    }
  }


  refiltro() {

    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();

    console.log(this.idFiltro + 'kk' + this.buscar);
    console.log(this.lista_tot);
    this.lista = [];
    for (const lili of this.lista_tot) {
      let estava = true;

      if (this.idFiltro !== 2) {
        if (this.idFiltro === 0) {
          if (!lili.enable) {
            estava = false;
          }
        } else {
          if (lili.enable) {
            estava = false;
          }
        }
      }
      if (estava) {
        if (this.buscar.trim() !== '') {
          this.objAfi = lili;
          if (!this.si_contiene()) {
            estava = false;
          }
        }
      }
      console.log("aca " + estava);
      if (estava) {
        if (this.idFicha !== 2) {
          if (this.idFicha === 0) {
            if (lili.status === 'T' || lili.status === 'R') {
              estava = false;
            }
          } else {
            if (lili.status !== 'T' && lili.status !== 'R') {
              estava = false;
            }
          }
        }
      }
      if (estava && this.elnucleo.id !== 999999 && this.nivel !== 10) {
        if (lili.elnucleo !== this.elnucleo.id) {
          estava = false;
        }
      }
      if (estava) {
        this.lista.push(lili);
      }
    }
    console.log(this.lista);
    Swal.close()
  }

  si_contiene(): boolean {
    let texto = '';
    texto = this.objAfi.cedula.toString() + ' ' + this.objAfi.nombres.trim() + ' ' + this.objAfi.apellidos.trim();
    texto = texto.toLowerCase();
    if (texto.search(this.buscar.trim().toLowerCase()) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  limpieza() {
    // sessionStorage.setItem('afi_idFiltro', '');
    // sessionStorage.setItem('afi_buscar'  , '');
    // sessionStorage.setItem('afi_idFicha' , '');
    // sessionStorage.setItem('afi_idNucleo', '');
    // console.log("nos vamos");

    this.ngOnInit();
  }

  teFiltro(event, dt) {
    this.lista_fil = event.filteredValue;
  }


  exportExcel(): void {
    const lisXls = [];
    if (this.dataTable.hasFilter()) {
      this.lista_leo = this.lista_fil;
    } else {
      this.lista_leo = this.lista;
    }


    for (let i = 0; i < this.lista_leo.length; i++) {
      let locname = '';
      if (this.lista_leo[i].loc != null && this.lista_leo[i].loc !== undefined) {
        locname = this.lista_leo[i].loc.nombre;
      }

      let ciuname = '';
      let depname = '';

      if (this.lista_leo[i].ciudad != null && this.lista_leo[i].ciudad !== undefined) {
        ciuname = this.lista_leo[i].ciudad.nombre;
        if (this.lista_leo[i].ciudad.dep != null) {
          depname = this.lista_leo[i].ciudad.dep.nombre;
        }
      }

      let fichaenimagen = false;
      if (this.lista_leo[i].loc != null) {
        fichaenimagen = true;
      }
      lisXls.push([
        this.lista_leo[i].cedula,
        this.lista_leo[i].apellidos,
        this.lista_leo[i].nombres,
        this.lista_leo[i].email,
        this.lista_leo[i].direccion,
        depname,
        ciuname,
        locname,
        this.lista_leo[i].telefonos,
        this.lista_leo[i].celular,
        this.lista_leo[i].sexo,
        this.lista_leo[i].fecnac,
        this.lista_leo[i].composicion,
        this.lista_leo[i].cargo,
        this.lista_leo[i].anioinginst,
        this.lista_leo[i].anioinginst,
        this.lista_leo[i].publico,
        this.lista_leo[i].fichapapel,
        fichaenimagen,
        this.lista_leo[i].enable,
        this.lista_leo[i].status,
        this.lista_leo[i].tipo,
        this.lista_leo[i].fecsoling,
        this.lista_leo[i].feculting,
        this.lista_leo[i].feculbaja
      ]);
    }

    const pHeader = ["Cedula", "Apellidos", "Nombres", "Email", "Direccion", "Departamento", "Ciudad"
      , "Localidad", "Telefono", "Celular", "Sexo", "Fec.Nac.", "Composicion", "Cargo", "Ing.Inst.",
      "Ing.Sector", "En publico", "Ficha papel", "Ficha img.", "Activo", "Status", "Tipo", "Fec.Sol.", "FecUltIng", "FecUltBaja"];
    const pCol = [10, 25, 25, 40, 40, 20, 20,
      20, 20, 20, 5, 10, 15, 20, 10,
      10, 10, 10, 10, 10, 15, 15, 10, 10, 10];
    const pTit = 'Listado de Afiliados';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  cambioFiltro() {
    this.buscar = '';
    this.refiltro();
  }

  onChangeFiltro(itemfil) {
    if (itemfil != 'Delegados') {
      this.elfiltro = itemfil;
      for (let i = 0; i < this.varsFiltro.length; i++) {
        if (this.varsFiltro[i].trim() === this.elfiltro.trim()) {
          this.idFiltro = i;
          this.refiltro();
          break;
        }
      }
    } else {
      this.elfiltro = itemfil;
      this.idFicha = 2; // set Todas las fichas en el combo fichas 
      console.log(this.elnucleo.id);
      Swal.fire({
        titleText: "Buscando delegados"
      });
      Swal.showLoading();
      this.afisrv.getAfiliadosDelegados(this.elnucleo.id).subscribe(res => {
        console.log(res);
        Swal.close();
        if (res) {
          this.lista = res;
        }
      }, err => {
        console.log(err);
        Swal.fire("Error", "No se pudo filtrar por delegados", "error")
      });
    }
  }

  onChangeFicha(itemfil) {
    this.laficha = itemfil;
    for (let i = 0; i < this.varsFicha.length; i++) {
      if (this.varsFicha[i].trim() === this.laficha.trim()) {
        this.idFicha = i;
        this.refiltro();
        break;
      }
    }

  }

  onChangeNucleo(itemfil) {
    // si es distinto a delegado
    let mellega = '';
    mellega = itemfil;
    if (mellega.substr(0, 6) === '999999') {
      this.elnucleo = this.varsNucleo[this.varsNucleo.length - 1];
      this.idNucleo = this.varsNucleo.length - 1;
      if (this.elfiltro != 'Delegados') {
        this.refiltro();
      } else {
        Swal.fire({
          titleText: "Buscando delegados"
        });
        Swal.showLoading();
        this.afisrv.getAfiliadosDelegados(999999).subscribe(res => {
          console.log(res);
          if (res) {
            this.lista = res;
          }
        },err => {
          console.log(err);
          Swal.fire("Error", "No se pudo filtrar por delegados", "error")
        });
      }
    } else {
      mellega = mellega.substr(5);

      for (let i = 0; i < this.varsNucleo.length; i++) {
        if (this.varsNucleo[i].nombre.trim() === mellega.trim()) {
          this.elnucleo = this.varsNucleo[i];
          this.idNucleo = i;

          if (this.elfiltro != 'Delegados') {
            this.refiltro();
          } else {
            this.idFicha = 2; // set Todas las fichas en el combo fichas 
            Swal.fire({
              titleText: "Buscando delegados"
            });
            Swal.showLoading();
            this.afisrv.getAfiliadosDelegados(this.elnucleo.id).subscribe(res => {
              console.log(res);
              Swal.close();
              if (res) {
                this.lista = res;
              }
            }, err => {
              console.log(err);
              Swal.fire("Error", "No se pudo filtrar por delegados", "error")
            });
          }
          break;
        }
      }

    }

  }


  inhab(content, cedula, momo) {
    this.modobaja = momo;
    console.log(this.modobaja);
    this.afisrv.getAfiliado(cedula).subscribe(
      resafi => {
        this.objAfi = resafi;
        this.listanuc = [];
        this.afisrv.getNucAfiliado(this.objAfi.cedula.toString()).subscribe(
          resnuca => {
            if (resnuca !== undefined) {
              this.listanuc = resnuca;
            }
          }
        );
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

  lobajo() {
    if (this.modobaja === 'B') {
      this.swaltit = '¿Desea deshabilitar afiliada/o?';
      this.swalmsg = 'Afiliada/o ' + this.objAfi.cedula + ' quedará inactiva/o';
    } else {
      this.swaltit = '¿Confirma la re-afilición?';
      this.swalmsg = 'Afiliada/o ' + this.objAfi.cedula + ' quedará activa/o';
    }
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        console.log("alteborro");
        this.teborro();
      }
    });
    this.modalService.dismissAll();
  }

  teborro() {
    let afidto: AfilDto;
    console.log(this.modobaja);
    if (this.modobaja === 'B') {
      this.objAfi.enable = false;
    } else {
      this.objAfi.enable = true;
      //this.objAfi.feculting = new Date(); que lo haga el back
    }
    afidto = new AfilDto();
    afidto.afiliado = this.objAfi;
    afidto.listanuc = this.listanuc;
    //console.log("me tirooo o",this.objAfi.enable);
    this.afisrv.saveAfiliado(afidto).subscribe(
      resu => {
        this.swaltit = 'Ok';
        this.swalmsg = 'Operación correcta';
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
        this.swalmsg = 'No se pudo marcar el registro';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  pdfficha(cedula) {
    this.afisrv.getAfiliado(cedula).subscribe(
      resaf => {
        this.objAfi = resaf;
        this.pdfsrv.generatePdf(this.objAfi);
      }
    );
  }


}
