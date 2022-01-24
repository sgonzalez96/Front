import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Nucleo } from '../../models/nucleo';
import { NucleosService } from '../../serv/nucleos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';
import { Usuario } from '../../../Admin/models/usuario';
import { AfiliadosService } from '../../serv/afiliados.service';
import { Afiliado } from '../../models/afiliado';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nucleo-lista',
  templateUrl: './nucleo-lista.component.html',
  styleUrls: ['./nucleo-lista.component.css']
})
export class NucleoListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista_tot: Nucleo[];
  lista: Nucleo[];
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
    private datsrv: DatosService) {
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
    this.lista_tot = [];
    this.afisrv.getNucAfiliado(this.elusu.afinro.toString()).subscribe(
    resafi => {
      if (this.nivel !== 50 && this.nivel !== 90) {
        for (const resa of resafi) {
          if (resa.nucleo.delegado1 === this.elusu.afinro || resa.nucleo.delegado2 === this.elusu.afinro) {
            this.nivel = 10;
            this.objNuc = resa.nucleo;
            break;
          }
        }
      }
      if (this.nivel === 10) {
        this.cargoNucleos();
      } else {
        this.nucsrv.getNucleos().subscribe(
          resmon => {
            this.lista_tot = resmon;
            this.lista = this.lista_tot;
            this.cargoNucleos();
          }
        );
      }
    }
    );
  }

  cargoNucleos() {
    this.lista = [];

    if (this.nivel === 10) {
      this.lista.push(this.objNuc); //solo el primero de los nucleos q es delegado
    } else {
      if (this.filtro) {
        for (let i=0; i < this.lista_tot.length; i++) {
          if (this.lista_tot[i].enable) {
            this.objNuc = this.lista_tot[i];
            if (this.si_contiene()) {
              this.lista.push(this.lista_tot[i]);
            }
          }
        }
      }
      else {
        if (this.buscar.trim() === '') {
          this.lista = this.lista_tot;
        } else {
          for (let i = 0; i < this.lista_tot.length; i++) {
            this.objNuc = this.lista_tot[i];
            if (this.si_contiene()) {
              this.lista.push(this.lista_tot[i]);
            }
          }
        }
      }
    }
  }

  si_contiene(): boolean {
    let texto = '';
    texto = this.objNuc.id.toString() + ' ' + this.objNuc.nombre + ' ' + this.objNuc.institucion;
    if (texto.search( this.buscar.trim().toLowerCase() ) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {
      let  locname = '';
      if (this.lista[i].loc != null && this.lista[i].loc !== undefined){
        locname = this.lista[i].loc.nombre ;
      }

      lisXls.push([
        this.lista[i].id ,
        this.lista[i].nombre ,
        this.lista[i].institucion ,
        this.lista[i].email,
        this.lista[i].direccion ,
        this.lista[i].ciudad.dep.nombre,
        this.lista[i].ciudad.nombre ,
        locname,
        this.lista[i].telefono ,
        this.lista[i].via.nombre ,
        this.lista[i].cuenta,
        this.lista[i].delegado1,
        this.lista[i].delegado2,
        this.lista[i].enable
      ]);
    }

    const pHeader = ["id","Nombre","Institucion","Email","Direccion","Departamento","Ciudad"
    ,"Localidad","Telefono","Forma de Pago","Cuenta","Delegada/o","Suplente","Activo"];
    const pCol = [10, 40,40,40,40,20,20,20,20,20,20,10,10,20];
    const pTit = 'Listado de Núcleos';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  cambioFiltro() {
    this.cargoNucleos();
  }

  inhabilitar(idNucleo) {
    this.swaltit = '¿Desea deshabilitar el núcleo?';
    this.swalmsg = 'El núcleo quedará marcado como inactivo';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idNucleo);
      }
    });
  }

  rehabilitar(idNucleo) {
    this.swaltit = '¿Desea re-habilitar el núcleo?';
    this.swalmsg = 'El núcleo quedará marcado como activo con fecha de pago = hoy';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idNucleo);
      }
    });

  }

  teborro(idNucleo) {
    this.nucsrv.getNucleo(idNucleo).subscribe(
      resu => {
        this.objNuc = resu;
        if (this.objNuc.enable) {
          this.objNuc.enable = false;
        } else {
          this.objNuc.enable = true;
          this.objNuc.fecinipago = new Date();
        }
        this.nucsrv.saveNucleo(this.objNuc).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Nucleo macado correctamente';
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
    );
  }


  opend1(content,nucleo) {
    this.listafi = [];
    this.nucsrv.getNucleo(nucleo).subscribe(
      resu => {
        this.objNuc = resu;
        this.afisrv.getAfiNucleo(nucleo).subscribe(
          resafi => {
            for (const nucafi  of resafi){
              this.listafi.push(nucafi.afiliado);
            }
            this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

}
