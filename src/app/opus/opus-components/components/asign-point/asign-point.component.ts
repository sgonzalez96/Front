import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Deposito } from '../../models/deposito';
import { DepositoRoot } from '../../models/deposito-root';
import { Plano } from '../../models/plano';
import { PuntoPicking } from '../../models/punto-picking';
import { PuntoPlano } from '../../models/punto-plano';
import { StorageCds } from '../../models/storage-cds';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-asign-point',
  templateUrl: './asign-point.component.html',
  styleUrls: ['./asign-point.component.scss']
})
export class AsignPointComponent implements OnInit {

  @ViewChild('dialogCreo', {static: false}) dialogCreo!: TemplateRef<NgbModal>;
  modalRefCreo!: NgbModalRef;

  plano!: Plano;
  modo = '';
  depo!: StorageCds;
  puntosList: PuntoPicking[] = [];
  puntoSeleccionado!: PuntoPicking;
  posx = 0;
  posxerror = false;
  posy = 0;
  posyerror = false;
  orden = 0;
  ordenerror = false;
  punto!: PuntoPlano;
  esalta = false;
  descpunto = '';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private matser: MatricerosService, private modalService: NgbModal) { }

  ngOnInit() {
    this.depo = this.config.data.depo;
    this.modo = this.config.data.modo;
    this.plano = this.config.data.plano;
    this.punto = this.config.data.punto;
    if (this.modo == 'M') {
      this.puntoSeleccionado = new PuntoPicking();
      this.puntoSeleccionado.pointId = this.punto.puntoId.toString();
      this.puntoSeleccionado.pointDsc = this.punto.puntoDsc;
      this.posx = this.punto.puntoX;
      this.posy = this.punto.puntoY;
      this.orden = this.punto.puntoOrd;
      this.esalta = false;
    } else {
      this.esalta = true;
    }
    this.cargoPuntos();
  }

  cargoPuntos() {
    this.matser.getPuntosPicking().subscribe(
      resu => {
        if (resu.error) {
          this.ref.close('NOP');
        } else {
          console.log(resu.object);
          for (const pp of resu.object) {
            let id = +pp.pointId;
            if (!this.yaExiste(id)) {
              this.puntosList.push(pp);
            }
          }
        }
      }, error => {
        this.ref.close('NOP');
      }
    );
  }

  yaExiste(id: number): boolean {
    if (this.plano.puntos != null && this.plano.puntos.length > 0) {
      for (const pp of this.plano.puntos) {
        if (pp.puntoId == id) {
          return true;
        }
      }
    }
    return false;
  }

  cambioPunto() {
    console.log(this.puntoSeleccionado);
    this.posx = 0;
    this.posy = 0;
    this.orden = 0;
  }

  asignoPunto(f: NgForm) {
    console.log(f);
    if (f.valid) {
      if (this.posx < 0) {
        this.posxerror = true;
        setTimeout(() => {
          this.posxerror = false;
        }, 3000);
      } else if (this.posy < 0) {
        if (f.value.posy == null || f.value.posy < 0) {
          this.posyerror = true;
          setTimeout(() => {
            this.posyerror = false;
          }, 3000);
        }
      } else if (this.orden < 0) {
        if (f.value.orden == null || f.value.orden < 0) {
          this.ordenerror = true;
          setTimeout(() => {
            this.ordenerror = false;
          }, 3000);
        }
      } else {
        this.teAsigno();
      }
    } else {
      if (f.value.posx == null || f.value.posx < 0) {
        this.posxerror = true;
        setTimeout(() => {
          this.posxerror = false;
        }, 3000);
      }
      if (f.value.posy == null || f.value.posy < 0) {
        this.posyerror = true;
        setTimeout(() => {
          this.posyerror = false;
        }, 3000);
      }
      if (f.value.orden == null || f.value.orden < 0) {
        this.ordenerror = true;
        setTimeout(() => {
          this.ordenerror = false;
        }, 3000);
      }
    }
  }

  teAsigno() {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.depo.erpCode;
    let arrplanos: Plano[] = [];
    let elplano = new Plano();
    elplano.planoId = this.plano.planoId;
    const lospuntos: PuntoPlano[] = [];
      let pp = new PuntoPlano();
    pp.puntoId = +this.puntoSeleccionado.pointId;
    pp.puntoOrd = this.orden;
    pp.puntoX = this.posx;
    pp.puntoY = this.posy;
    lospuntos.push(pp);
    elplano.puntos = lospuntos;
    arrplanos.push(elplano);
    eldep.planos = arrplanos;
    miroot.deposito = eldep;

    this.matser.asignoPuntoAPlano(miroot).subscribe(
      resu => {
        if (resu.error) {
          this.ref.close('MAL');
        } else {
          this.ref.close('OK');
        }
      }, error => {
        this.ref.close('MAL');
      }
    );
  }

  closemodal() {
    this.ref.close('NN');
  }

  creoPunto() {
    this.descpunto = '';
    this.modalRefCreo = this.modalService.open(this.dialogCreo, {
      backdrop: 'static', size: 'lg', keyboard: false, centered: true
    });
    this.modalRefCreo.result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  teCreo() {
    if (this.descpunto == null || this.descpunto == undefined || this.descpunto == '') {
      Swal.fire({
        title: 'Debe ingresar descripción!!!',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    } else {
      let ppicking = new PuntoPicking();
      ppicking.pointDsc = this.descpunto;
      this.matser.setPuntoPicking(ppicking).subscribe(
        resu => {
          this.descpunto = '';
          Swal.fire({
            title: 'Punto de picking creado con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.modalRefCreo.close();
          this.cargoPuntos();
        }, error => {
          Swal.fire({
            title: 'Error al intentar crear el punto de picking',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
}
