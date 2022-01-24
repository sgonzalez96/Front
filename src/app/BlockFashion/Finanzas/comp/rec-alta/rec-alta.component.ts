import { AfilNucleo } from './../../../Afiliados/models/afilnuc';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MovCont } from '../../models/movcont';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { Moneda } from '../../../Admin/models/moneda';
import { MonedaService } from '../../../Admin/services/moneda.service';
import { Via } from '../../../Admin/models/via';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { MovContDet } from '../../models/movcondet';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { formatDate, Location } from '@angular/common';
import { MovcontService } from '../../serv/movcont.service';
import Swal from 'sweetalert2';
import { BcoMov } from '../../models/bcomov';
import { BcoPago } from '../../models/bcopago';
import { MovbcoService } from '../../serv/movbco.service';
import { PagbcoService } from '../../serv/pagbco.service';
import { round } from 'd3';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-rec-alta',
  templateUrl: './rec-alta.component.html',
  styleUrls: ['./rec-alta.component.css']
})
export class RecAltaComponent implements OnInit {
  @ViewChild('modalDialog', null) dialogItem: TemplateRef<NgbModal>;
  @ViewChild('selectNuc', null) dialogNuc: TemplateRef<NgbModal>;
  @ViewChild('selectAfi', null) dialogAfi: TemplateRef<NgbModal>;

  objRec: MovCont = new MovCont();
  varsVia: Via[];
  lavia: Via = new Via();
  vavia = true;
  varsMon: Moneda[];
  lamon: Moneda = new Moneda();
  closeResult = '';
  fechoy = '';
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  ultpago = '';
  ultimpo = 0;
  habnuc = false;

  objDet: MovContDet;
  objDup: MovContDet;
  objNuc: Nucleo = new Nucleo();
  objAfi: Afiliado = new Afiliado();
  nucId = 1;
  afiId = '0';
  indi = '';
  saldo_ini = 0;
  valor_cuota = 210;
  mov_cancela: number[] = [];

  haymov = false;
  haypago = false;
  objBcoMov: BcoMov = new BcoMov();
  objBcoPago: BcoPago = new BcoPago();

  modalRefIte: NgbModalRef;
  modalRefNuc: NgbModalRef;
  modalRefAfi: NgbModalRef;
  ultimoRecibo: string;
  viaPago: number = 1;

  afiNuc: AfilNucleo[] = [];

  constructor(
    private viasrv: ViapagoService,
    private monsrv: MonedaService,
    private modalService: NgbModal,
    private nucsrv: NucleosService,
    private afisrv: AfiliadosService,
    private movsrv: MovcontService,
    private bcomovsrv: MovbcoService,
    private bcopagosrv: PagbcoService,
    private _location: Location
  ) {
  }

  async ngOnInit() {
    console.log("llegamos ");

    this.viasrv.getVias().subscribe(
      resvia => {
        console.log("dame vias");
        console.log(resvia);
        this.varsVia = resvia;
        this.lavia = this.varsVia[0];
        this.vavia = true;

        if (sessionStorage.getItem('recibo_viaId') != null &&
          sessionStorage.getItem('recibo_viaId') != undefined) {
          let idvia = parseInt(sessionStorage.getItem('recibo_viaId'), 10);
          if (idvia !== 0) {
            for (const vivi of this.varsVia) {
              if (vivi.id === idvia) {
                this.lavia = vivi;
                this.objRec.recibo = this.lavia.proximo;
                this.objRec.viapago = this.lavia;
                this.vavia = false;

                break;
              }
            }
          }
        }

        this.getUltFecha(this.lavia.id);
        this.objRec.recibo = this.lavia.proximo;
        // if (sessionStorage.getItem('recibo_fecha') != null &&
        //     sessionStorage.getItem('recibo_fecha') != undefined) {
        //     this.fechoy = sessionStorage.getItem('recibo_fecha');
        // } else {
        //   this.fechoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
        // }

        this.objRec.descripcion = sessionStorage.getItem('recibo_desc');
        this.objRec.notas = sessionStorage.getItem('notas');
        this.objRec.referencia = sessionStorage.getItem('recibo_refe');
        if (sessionStorage.getItem('recibo_movId') != null &&
          sessionStorage.getItem('recibo_movId') !== undefined) {

          for (const undoc of sessionStorage.getItem('recibo_movId').split(',')) {
            this.mov_cancela.push(parseInt(undoc, 10));
          }

          const elid = this.mov_cancela[0].toString();
          console.log("ELID " + elid);
          console.log(this.mov_cancela);
          if (this.mov_cancela.length == 1) {
            this.bcomovsrv.getMovBco(elid).subscribe(
            resmov => {
              this.objBcoMov = resmov;
              this.saldo_ini = this.objBcoMov.credito;
              if (this.saldo_ini == 0) {
                this.saldo_ini = this.objBcoMov.debito;
                //this.saldo_ini = 1200;
              }
              this.haymov = true;
              console.log("por aca " + this.saldo_ini);
            }
          );
          }
          
          //si quiere seleccionar mas de un movimiento para el recibo
          //para comprobar el monto total de los movimientos

          if (this.mov_cancela.length > 1) {
            this.bcomovsrv.getSeveralMovBco(this.mov_cancela).subscribe(
              resmov => {
                this.objBcoMov = resmov[0]; // por ahora toma la info solo del primero 
                resmov.forEach(elmt => {
                  // el monto si lo suma de los dos movimientos
                  if (elmt.credito == 0) {
                    this.saldo_ini = this.saldo_ini + elmt.debito;
                  }else if(elmt.debito == 0){
                    this.saldo_ini = this.saldo_ini + elmt.credito;
                  }else if (elmt.debito == 0 && elmt.credito == 0){
                    this.saldo_ini = 0;
                  }
                });

                this.haymov = true;
                console.log("por aca " + this.saldo_ini);
              }
            );
          }

        }

        if (sessionStorage.getItem('recibo_pagoId') != null &&
          sessionStorage.getItem('recibo_pagoId') !== undefined) {
          this.bcopagosrv.getPagoBco(sessionStorage.getItem('recibo_pagoId')).subscribe(
            respago => {
              this.objBcoPago = respago;
              this.haypago = true;
            }
          );
        }
        let mesant = parseInt(this.fechoy.substr(5, 2), 10) - 1;
        this.ultpago = this.fechoy.substr(0, 4) + '-' + ('0' + mesant).slice(-2);
        this.objRec.detalle = [];
        this.recargo();


      }
    );
    this.monsrv.getMonedas().subscribe(
      resmon => {
        this.varsMon = resmon;
        this.lamon = this.varsMon[0];
      }
    );
    this.nucsrv.getNucleo('0').subscribe(
      renu => {
        this.objNuc = renu;
      }
    );
    console.log(this.objRec);
    console.log(sessionStorage);

  }

  // comprobar fecha mayor que fecha ultimo recibo
  onChangeDate(event) {
    console.log(typeof event);
    let fechEvent = new Date(event);
    let fechultRecibo = new Date(this.ultimoRecibo);
    if (fechEvent < fechultRecibo) {
      Swal.fire({
        title: "Error",
        text: "La fecha no puede ser menor del ultimo recibo",
        type: 'warning',
        confirmButtonText: 'OK',
      });
      this.fechoy = this.ultimoRecibo;
    }



  }

  // set id via
  setIdVia(id: number) {
    this.viaPago = id;
    console.log(this.viaPago);
  }

  onChangeVia(mellega) {
    console.log(mellega);
    for (const vivi of this.varsVia) {
      if (vivi.nombre.trim() == mellega.trim()) {
        this.lavia = vivi;
        this.objRec.recibo = this.lavia.proximo;
        break;
      }


    }

    // cambiar de fecha segun eleccion
    this.viaPago = this.lavia.id;
    console.log(this.lavia.id);
    this.getUltFecha(this.viaPago);
  }

  onChangeMon(mellega) {
    console.log(mellega);
    for (const momo of this.varsMon) {
      if (momo.simbolo.trim() == mellega.trim()) {
        this.lamon = momo;
        this.objRec.mon = this.lamon;
        break;
      }
    }
  }

  /// ------------------- Validacion y creacion del formulario


  crearRecibo(f: NgForm) {
    console.log(this.saldo_ini);
    console.log(this.objRec.importe);
    if (this.objRec.descripcion == null || this.objRec.descripcion === '') {
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
    if (this.objRec.importe === 0) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Importe del recibo en cero';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }else if( this.saldo_ini != 0 &&this.saldo_ini < this.objRec.importe ){
      this.swaltit = 'Atención';
      this.swalmsg = 'Importe del recibo  mayor que el total a abonar';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }else if(this.saldo_ini > this.objRec.importe){
      this.swaltit = 'Atención';
      this.swalmsg = 'Importe del recibo es menor al total a abonar';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'info',
        confirmButtonText: 'OK',
        showCancelButton:true,
      }).then((res)=>{
        if (res.value) {
          this.grabo();
        }
      });
    }else if (this.saldo_ini == this.objRec.importe) {
      this.grabo();
    }
    else if (this.saldo_ini == 0) {
      this.grabo();
    }
    
  }

  grabo() {
    Swal.fire({
      title: "Guardando"
    });Swal.showLoading();
    let anio = parseInt(this.fechoy.substr(0, 4), 10);
    let mes = parseInt(this.fechoy.substr(5, 2), 10);
    let dia = parseInt(this.fechoy.substr(8, 2), 10);
    this.objRec.fecha = new Date(anio, mes - 1, dia);
    this.objRec.tipo = "R";
    this.objRec.signo = 1;
    this.objRec.viapago = this.lavia;
    this.objRec.mon = this.lamon;
    console.log(this.objRec.fecha);
    this.movsrv.saveMovcont(this.objRec).subscribe(
      resdat => {
        this.objRec = resdat;
        if (this.haymov) {
          this.gramov();
        } else {
          this.msgok();
        }
      },
      error => {
        this.swaltit = 'Error!';
        this.swalmsg = 'Error al crear el recibo';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  msgok() {
    // this.swaltit = 'Ok';
    // this.swalmsg = 'El recibo fue creado correctamente'
    // Swal.fire({
    //       title: this.swaltit,
    //       text: this.swalmsg,
    //       type: 'success',
    //       confirmButtonText: 'OK',
    // });
    this.volver();
  }

  gramov() {
    for (const elmov of this.mov_cancela) {
      this.bcomovsrv.getMovBco(elmov.toString()).subscribe(
        bcomov => {
          this.objBcoMov = bcomov;
          this.objBcoMov.estado = 'C';
          this.objBcoMov.movcont = this.objRec;
          this.bcomovsrv.saveMovBco(this.objBcoMov).subscribe(
            resoka => {
              if (this.haypago) {
                this.grapago();
              } else {
                this.msgok();
              }
            }
          );
        }
      );
    }
  }

  grapago() {
    this.bcopagosrv.getPagoBco(this.objBcoPago.id.toString()).subscribe(
      bcopago => {
        this.objBcoPago = bcopago;
        this.objBcoPago.estado = 'C';
        this.objBcoPago.movcont = this.objRec;
        this.bcopagosrv.savePagoBco(this.objBcoPago).subscribe(
          resoka => {
            this.msgok();
          }
        );
      }
    );
  }

  getUltFecha(viaPago: number) {
    this.movsrv.getDateLastReceipt(viaPago).subscribe((res) => {
      this.fechoy = res.toString();
      this.ultimoRecibo = res.toString();
    });
  }

  /// ------------------- Manejo de una liena de recibo --------------------------- \\\

  ite_open(content) {
    this.indi = '';
    this.habnuc = true;
    this.objDet = new MovContDet();
    this.objDet.nucleo = this.objNuc;
    this.objDet.afiliado = this.objAfi; //ojo el null
    const maxitem = this.objRec.detalle.length;
    if (maxitem > 0) {
      this.objDet.nucleo = this.objRec.detalle[maxitem - 1].nucleo;
      if (this.objRec.detalle[maxitem - 1].afiliado != null) {
        this.objDet.afiliado = this.objRec.detalle[maxitem - 1].afiliado;
      }
      this.habnuc = false;
    }
    if (this.saldo_ini != 0 && this.saldo_ini - this.objRec.importe > 0) {
      this.objDet.importe = this.saldo_ini - this.objRec.importe;
    } else {
      this.objDet.importe = this.ultimpo;
    }

    this.objDet.cantidad = 1;
    if (this.objDet.importe > 0) {
      this.objDet.cantidad = round(this.objDet.importe / this.valor_cuota);
    }

    this.objDet.mespago = this.ultpago;
    this.nucId = this.objDet.nucleo.id;
    this.afiId = this.objDet.afiliado.cedula;

    this.modalRefIte = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    this.modalRefIte.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ite_edit(content, i) {
    this.habnuc = false;
    this.indi = i;
    this.objDet = new MovContDet();
    this.objDet = this.objRec.detalle[this.indi];
    if (this.objDet.nucleo.id === 1) {
      this.afisrv.getAfiNucleo(this.objAfi.cedula).subscribe(
        resnuc => {
          let esta = false;
          for (const afinuc of resnuc) {
            if (afinuc.nucleo.id === 1 && afinuc.cotizante) {
              esta = true;
              break;
            }
          }
          if (!esta) {
            this.swaltit = 'Error!';
            this.swalmsg = 'El afiliado no cotiza en nucleo 1';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'error',
              confirmButtonText: 'OK',
            });
            return;
          }
        }
      );
    }
    this.objDet.mespago = this.objDet.mespago.substr(0, 4) + '-' + this.objDet.mespago.substr(4, 2);

    this.nucId = this.objDet.nucleo.id;
    if (this.objDet.afiliado == null) {
      this.objDet.afiliado = this.objAfi;
    }
    this.afiId = this.objDet.afiliado.cedula;

    this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ite_baja(i) {

    this.indi = i;
    let listabaja: MovContDet[];
    listabaja = this.objRec.detalle;
    listabaja.splice(parseInt(this.indi, 10), 1);
    this.recargo();
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

    console.log("por aca baby");

    this.nucsrv.getNucleo(minucleo.trim()).subscribe(
      resnu => {
        if (resnu != null) {
          this.objDet.nucleo = resnu;
          this.seteomes();
        } else {
          this.objDet.nucleo = this.objNuc;
          this.nucId = this.objNuc.id;
          this.seteomes();
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
        this.objDet.nucleo = this.objNuc;
        this.nucId = this.objNuc.id;
        this.seteomes();
      }
    );
  }

  cambioImporte() {
    console.log("se invoa");
    if (this.objDet.importe > 0 && this.objDet.nucleo.tipo_cot != 'P') {
      this.objDet.cantidad = round(this.objDet.importe / this.valor_cuota);
    }
  }

  cambioAfiliado(elafi) {
    let micedula = '';
    let correcto: boolean = false;
    micedula = elafi;
    this.afisrv.getAfiliado(micedula.trim()).subscribe(
      resnu => {

        if (resnu != null && resnu != undefined) {
          this.afisrv.getNucAfiliado(resnu.cedula).subscribe((res) => {
            if (res) {
              res.forEach(elm => {
                if (elm.cotizante && elm.nucleo.id == 1) {
                  correcto = true;
                }
              });
              if (!correcto) {
                this.afiId = "";
                this.swaltit = 'Error!';
                this.swalmsg = 'Este afiliado no pertenece al nucleo';
                Swal.fire({
                  title: this.swaltit,
                  text: this.swalmsg,
                  type: 'error',
                  confirmButtonText: 'OK',
                });
                
              }else{
                this.objDet.afiliado = resnu;
                this.seteomesAfi();
              }
            }
          })
          
          

        } else {
          this.objDet.afiliado = this.objAfi;
          this.afiId = this.objAfi.cedula;
          this.swaltit = 'Error!';
          this.swalmsg = 'Error el afiliado no ha sido hallado';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }

      }, error => {
        this.objDet.afiliado = this.objAfi;
        this.afiId = this.objAfi.cedula;

        this.swaltit = 'Error!';
        this.swalmsg = 'Error el afiliado no ha sido hallado';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  agrego(i) {
    

    if (this.objDet.importe == null || this.objDet.importe === 0) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar un importe';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    console.log(this.objDet);
    if (this.objDet.nucleo.id == 1 && !this.objDet.afiliado.enable) {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar un afiliado';
      Swal.fire({
        title: this.swaltit,
        text: this.swalmsg,
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    let errores = false;
    this.ultpago = this.objDet.mespago;  //aaaa-mm

    let mes_sig = parseInt(this.ultpago.substr(5, 2), 10) + 1;
    let ani_sig = parseInt(this.ultpago.substr(0, 4), 10);
    if (mes_sig > 12) {
      mes_sig = 1;
      ani_sig = ani_sig + 1;
    }
    this.ultpago = ani_sig + '-' + ('0' + mes_sig).slice(-2);


    this.ultimpo = this.objDet.importe;
    this.objDet.mespago = this.objDet.mespago.substr(0, 4) + this.objDet.mespago.substr(5, 2);

    if (this.objDet.nucleo.id !== 1) {
      this.objDet.afiliado = null;
    }
    this.objDet.fecharecibo = new Date();
    if (this.objDet.nucleo.id === 0) {
      this.metelo();
    } else {
      this.movsrv.chkDetalle(this.objDet).subscribe(
        resudet => {
          if (resudet !== undefined && resudet != null && resudet.id !== 0) {
            this.objDup = resudet;
            this.swaltit = '¿Desea crear igual otro pago?';
            this.swalmsg = 'El pago del ' + this.objDup.fecharecibo + ' por ' + this.objDup.importe + 'podria ser duplicado';
            this.swaldos = 'Cancelar';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
              showCancelButton: true,
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.value) {
                this.metelo();
              }
            });
          } else {
            this.metelo();
          }
        }
      );
    }
  }

  metelo() {
    console.log('antes');
    console.log(this.objRec.detalle);
    console.log(this.indi);
    if (this.indi === '') {
      this.objRec.detalle.push(this.objDet);
    } else {
      this.objRec.detalle[parseInt(this.indi, 10)] = this.objDet;
    }


    this.modalService.dismissAll();
    this.recargo();
  }

  recargo() {
    this.objRec.importe = 0;

    for (const lili of this.objRec.detalle) {
      this.objRec.importe += lili.importe;
    }
  }

  volver() {
    this._location.back();
  }

  openNuc(content) {
    this.modalRefNuc = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    this.modalRefNuc.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }


  elijoNuc() {
    this.nucId = this.objNuc.id;
    this.objDet.nucleo = this.objNuc;
    this.seteomes();
    this.modalRefNuc.close();
  }

  closeNuc() {
    this.modalRefNuc.close();
  }


  openAfi(content) {
    this.modalRefAfi = this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    this.modalRefAfi.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  elijoAfi() {
    this.afiId = this.objAfi.cedula;
    this.objDet.afiliado = this.objAfi;
    this.modalRefAfi.close();

    this.seteomesAfi();
  }


  closeAfi() {
    this.modalRefAfi.close();
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

  seteomes() {
    console.log("aca me da" + this.objDet.nucleo.fecultpago);
    if (this.objDet.nucleo.fecultpago != null && this.objDet.nucleo.fecultpago.trim() != '') {
      this.ultpago = this.objDet.nucleo.fecultpago.toString();  //aaaa-mm
      console.log("mir ames antes " + parseInt(this.ultpago.substr(4, 2), 10));
      let mes_sig = parseInt(this.ultpago.substr(4, 2), 10) + 1;
      let ani_sig = parseInt(this.ultpago.substr(0, 4), 10);
      console.log("mir ames " + mes_sig);
      if (mes_sig > 12) {
        mes_sig = 1;
        ani_sig = ani_sig + 1;
      }
      this.ultpago = ani_sig + '-' + ('0' + mes_sig).slice(-2);
      this.objDet.mespago = this.ultpago;
    }else{
      let currentDate =  new Date();
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();
      if (month == 0) {
        month= 12;
    }else{
      year = year-1;
    }
      let value = year.toString() + "-" + ('0' + month).slice(-2);
      this.ultpago = value;
      this.objDet.mespago = this.ultpago;
    }

    console.log("lo reseteeee " + this.ultpago);
  }

  seteomesAfi() {
    console.log("aca me da" + this.objDet.nucleo.fecultpago);
    if (this.objDet.afiliado.fecultpago != null && this.objDet.afiliado.fecultpago.trim() != "") {
      this.ultpago = this.objDet.afiliado.fecultpago.toString();  //aaaa-mm
      console.log("mir ames antes " + parseInt(this.ultpago.substr(4, 2), 10));
      let mes_sig = parseInt(this.ultpago.substr(4, 2), 10) + 1;
      let ani_sig = parseInt(this.ultpago.substr(0, 4), 10);
      console.log("mir ames " + mes_sig);
      if (mes_sig > 12) {
        mes_sig = 1;
        ani_sig = ani_sig + 1;
      }
      this.ultpago = ani_sig + '-' + ('0' + mes_sig).slice(-2);
      this.objDet.mespago = this.ultpago;
    }else{
      let currentDate =  new Date(Date.now());
      let month = currentDate.getMonth();
      let year = currentDate.getFullYear();
      if (month == 0) {
          month= 12;
          year = year-1;
      }
      let value = year + "-" + ('0' + month).slice(-2);// por si tiene tres digitos 
      this.ultpago = value;
      this.objDet.mespago = this.ultpago;
    }

    console.log("lo reseteeee " + this.ultpago);
  }
}
