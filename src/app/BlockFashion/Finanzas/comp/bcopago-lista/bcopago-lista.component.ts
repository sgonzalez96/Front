import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { BcoPago } from '../../models/bcopago';
import { Dato } from '../../../Admin/models/dato';
import { PagbcoService } from '../../serv/pagbco.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { formatDate } from '@angular/common';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import Swal from 'sweetalert2';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { Usuario } from '../../../Admin/models/usuario';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bcopago-lista',
  templateUrl: './bcopago-lista.component.html',
  styleUrls: ['./bcopago-lista.component.css']
})
export class BcopagoListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: BcoPago[];
  objMov: BcoPago;
  objDato: Dato;
  objNuc: Nucleo;
  idNuc = '';
  objAfi: Afiliado;
  idAfi = '';
  hayalta = false;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  estini = ' ';
  estfin = 'X';
  varsOpcion = ['Todos', 'Pendientes', 'Conciliados', 'Descartados'];
  laopcion = '';

  elusu: Usuario;
  nivel = 0;

  modalRefNuc: NgbModalRef;
  closeResult: string;



  constructor(
    private movsrv: PagbcoService,
    private datsrv: DatosService,
    private nucsrv: NucleosService,
    private afisrv: AfiliadosService,
    private logsrv: LoginService,
    private excsrv: ExceljsService,
    private modalService: NgbModal,
    ) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();

    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.fecfin = this.fecini;
    this.laopcion = this.varsOpcion[0];
    if (sessionStorage.getItem('listapagbco_opc') != null &&
        sessionStorage.getItem('listapagbco_opc') != undefined) {
        this.laopcion = sessionStorage.getItem('listapagbco_opc');
        this.fecini = sessionStorage.getItem('listapagbco_feci');
        this.fecfin = sessionStorage.getItem('listapagbco_fecf');
        this.idAfi = sessionStorage.getItem('listapagbco_afiId');
        this.idNuc = sessionStorage.getItem('listapagbco_nucId');
        this.nucsrv.getNucleo(this.idNuc).subscribe(
          resnu => {
            this.objNuc = resnu;
            if (this.objNuc.id == 1) {

              this.afisrv.getAfiliado(this.idAfi).subscribe(
                resafi => {
                  this.objAfi = resafi;
                  this.cargo();
                }
              );
            } else {
              this.idAfi = '';
              this.objAfi = null;
              this.cargo();
            }
          }, error => {
            this.cargo();
          }
        );

    } else {
      // creo objNuc y Afi
      // Segun el perfil del usuario si se le da chance de hacer que
      this.objAfi = null;
      this.objNuc = null;
      if (this.nivel <= 10) {
        this.idAfi = this.elusu.afinro.toString();
        console.log("antes " + this.idAfi);
        this.afisrv.getAfiliado(this.idAfi).subscribe(
          resafi => {
            this.objAfi = resafi;
            console.log("el objeto ")
            console.log(this.objAfi);
            if (this.objAfi.elnucleo != 1) {
              if (this.nivel === 10) {
                //this.idNuc = this.objAfi.elnucleo.toString();
                this.afisrv.getNucAfiliado(this.elusu.afinro.toString()).subscribe(
                  resafinuc => {
                    for (const resa of resafinuc) {
                      if (resa.cotizante) {
                        this.idNuc = resa.nucleo.id.toString();
                        this.objNuc = resa.nucleo;
                        this.cargo();
                      }
                    }
                  }
                );
              } else {
                alert("Error grave no deberia estar aca con nucleo <> 1")
              }

            } else {
              this.idNuc = '1';
              this.nucsrv.getNucleo(this.idNuc).subscribe(
                resnu => {
                  this.objNuc = resnu;
                  this.cargo();
                }
              );
            }
          }
        );
      } else {
        this.cargo();
      }
    }
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
  }


  cargo() {
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.lista = [];
    sessionStorage.setItem('listapagbco_opc', this.laopcion);
    sessionStorage.setItem('listapagbco_feci', this.fecini);
    sessionStorage.setItem('listapagbco_fecf', this.fecfin);
    if (this.objNuc != null) {
      sessionStorage.setItem('listapagbco_nucId', this.objNuc.id.toString());
    } else {
      sessionStorage.setItem('listapagbco_nucId', '0');
    }
    if (this.objAfi != null) {
      sessionStorage.setItem('listapagbco_afiId', this.objAfi.cedula);
    } else {
      sessionStorage.setItem('listapagbco_afiId', '');
    }
    if (this.laopcion === this.varsOpcion[1]){
      this.estini = ' ';
      this.estfin = 'B';
    } else if (this.laopcion === this.varsOpcion[2]) {
      this.estini = 'C';
      this.estfin = 'C';
    } else if (this.laopcion === this.varsOpcion[3] ) {
      this.estini = 'X';
      this.estfin = 'X';
    } else {
      this.estini = ' ';
      this.estfin = 'X';
    }
    this.hayalta = false;
    console.log("a cargar ",this.objNuc,this.objAfi);

    if (this.objNuc != null) {
      if (this.objAfi != null) {
        console.log("hay afi");
        this.hayalta = true;
        this.movsrv.getPagosAfi(this.objAfi.cedula,this.fecini,this.fecfin,this.estini,this.estfin,'2','2').subscribe(
          resmov => {
            this.lista = resmov;
            Swal.close();
          }
        );
      } else {
        console.log("el id ",this.objNuc.id);
        if (this.objNuc.id == 1) {
          this.hayalta = false;
        } else {
          this.hayalta = true;
        }
        this.movsrv.getPagosNuc(this.objNuc.id.toString(),this.fecini,this.fecfin,this.estini,this.estfin,'2','2').subscribe(
          resmov => {
            this.lista = resmov;
            Swal.close()
          }
        );
      }
    }
    console.log(this.hayalta);

  }


  onChangeTipo(uno){
    this.laopcion = uno;
  }

  exportExcel(): void {
    // const lisXls = [];
    // for (let i = 0; i < this.lista.length; i++) {
    //   let movcont = '';
    //   if (this.lista[i].movcont != null) {
    //     movcont = this.lista[i].movcont.id + ' - ' + this.lista[i].descripcion;
    //   }
    //   lisXls.push([
    //     this.lista[i].fecha ,
    //     this.lista[i].descripcion ,
    //     this.lista[i].documento ,
    //     this.lista[i].deposito,
    //     this.lista[i].asunto ,
    //     this.lista[i].debito ,
    //     this.lista[i].credito ,
    //     this.lista[i].estado ,
    //     movcont
    //   ]);
    // }

    // const pHeader = ["Fecha","Descripción","Documento","Depósito","Asunto","Débito","Crédito"
    // ,"Estado","Mov.Cont"];
    // const pCol = [15, 30,25,40,30,15,15,20,50];
    // const pTit = 'Listado de Movimeintos Bancarios';
    // const pSubtit = '';
    // this.excsrv.generateExcelFix(
    //   pTit, pSubtit, this.objDato,
    //   pHeader, pCol, lisXls, [],
    //   [], [], [],
    //   {}
    // );
  }



  //----------------------------------------

  openNuc(content) {
    this.modalRefNuc = this.modalService.open(content, {backdrop: 'static', size: 'lg', keyboard: false, centered: true});
    this.modalRefNuc.result.then(
      (result) => {
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
      return  `with: ${reason}`;
    }
  }

  elijoNuc() {
    this.idNuc = this.objNuc.id.toString();
    this.objNuc = this.objNuc;
    this.modalRefNuc.close();
  }

  closeNuc() {
    this.modalRefNuc.close();
  }

  inhab(idRec) {
    // this.swaltit = '¿Desea descartar el movimiento contable?';
    // this.swalmsg = 'El recibo será eliminado de la base de datos';
    // this.swaldos = 'Cancelar';
    // Swal.fire({
    //   title: this.swaltit,
    //   text: this.swalmsg,
    //   type: 'warning',
    //   showCancelButton: true,
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.value) {
    //     this.teborro(idRec);
    //   }
    // });
    this.cambioest(idRec);
  }


  cambioest(idRec) {
    this.movsrv.getPagoBco(idRec).subscribe(
      resmov => {
        this.objMov = resmov;
        if (this.objMov.estado.trim() === ''){
          this.objMov.estado = 'X';
        } else if (this.objMov.estado.trim() === 'X') {
          this.objMov.estado = ' ';
        }
        this.movsrv.savePagoBco(this.objMov).subscribe(
          resu => {
                this.swaltit = 'Ok';
                this.swalmsg = 'Estado modificado';
                Swal.fire({
                  title: this.swaltit,
                  text: this.swalmsg,
                  type: 'success',
                  confirmButtonText: 'OK',
                });
                this.cargo();
              },
                error => {
                  this.swaltit = 'Error';
                  this.swalmsg = 'No se pudo modificar el registro';
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

  cambioNuc(mellega) {
    this.hayalta = false;
    this.lista = [];
    this.idNuc = mellega;
      //@todo valido que sean numeros
      if (this.idNuc === undefined ||
        this.idNuc === null ||
        this.idNuc.trim() ==='' ) {
        this.swaltit = 'Atención';
        this.swalmsg = 'El núcleo no puede estar vacío';
        Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
      this.nucsrv.getNucleo(this.idNuc.trim()).subscribe(
        resnuc => {
          if (resnuc != null && resnuc  !== undefined) {
            this.objNuc = resnuc;
            this.objAfi = null;
            if (this.objNuc.id !== 1){
              this.cargo();
            }
          } else  {
            this.swaltit = 'Atención';
            this.swalmsg = 'Núcleo inexistente en el padrón';
            this.objNuc = null;
            this.objAfi = null;
            this.hayalta = false;
            Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'warning',
              confirmButtonText: 'OK',
            });
          }

        }, error => {
          this.swaltit = 'Atención';
          this.swalmsg = 'Error al leer núcleo';
          this.objNuc = null;
          this.objAfi = null;
          this.hayalta = false;
          Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      );
  }

  cambioAfi(mellega) {
    this.hayalta = false;
    this.lista = [];

    this.idAfi = mellega;
      //@todo valido que sean numeros
      if (this.idAfi === undefined ||
        this.idAfi === null ||
        this.idAfi.trim() ==='' ) {
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
      this.afisrv.getAfiliado(this.idAfi).subscribe(
        resafi => {
          if (resafi != null && resafi !== undefined) {
            this.objAfi = resafi;
            this.cargo();
          } else  {
            this.objAfi = null;
            this.hayalta = false;
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
          this.objAfi = null;
          this.hayalta = false;
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

}
