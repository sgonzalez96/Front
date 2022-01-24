import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Deposito } from '../../models/deposito';
import { DepositoRoot } from '../../models/deposito-root';
import { LocaCheck } from '../../models/loca-check';
import { Locacion } from '../../models/locacionDep';
import { Plano } from '../../models/plano';
import { PuntoPlano } from '../../models/punto-plano';
import { StorageCds } from '../../models/storage-cds';
import { TipoEstanteria } from '../../models/tipo-estanteria';
import { MatricerosService } from '../../services/matriceros.service';


@Component({
  selector: 'app-asigno-locaciones',
  templateUrl: './asigno-locaciones.component.html',
  styleUrls: ['./asigno-locaciones.component.scss']
})
export class AsignoLocacionesComponent implements OnInit {

  listEstanterias: TipoEstanteria[] = [];
  depo!: StorageCds;
  plano!: Plano;
  punto!: PuntoPlano;
  estanteriaSeleccionada!: TipoEstanteria;
  solosinasignar = true;
  listLocaciones: LocaCheck[] = [];

  constructor(private matser: MatricerosService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.depo = this.config.data.depo;
    this.plano = this.config.data.plano;
    this.punto = this.config.data.punto;
    this.matser.getTiposDeEstanteria().subscribe(
      resu => {
        if (resu.error) {
          this.ref.close('NOESTANTERIAS');
        } else {
          this.listEstanterias = resu.object;
          if (this.listEstanterias != null && this.listEstanterias != undefined && this.listEstanterias.length > 0) {
            this.estanteriaSeleccionada = this.listEstanterias[0];
            this.getLocaciones();
          } else {
            this.ref.close('0ESTANTERIAS');
          }
        }
      }, error => {
        this.ref.close('NOESTANTERIAS');
      }
    );
  }

  getLocaciones() {
    this.listLocaciones = [];
    let estante = this.estanteriaSeleccionada.id;
    if (this.estanteriaSeleccionada.id == '-1') {
      estante = '*';
    }
    this.matser.getLocacionesPosibles(this.depo.erpCode, this.solosinasignar, estante).subscribe(
      resu => {
        if (resu == null) {
          this.ref.close('NOLOCA');
        } else {
          this.listLocaciones = resu;
          console.log(this.listLocaciones)
        }
      }, error => {
        console.log(error);
        this.ref.close('NOLOCA');
      }
    );
  }

  cambioTipoEstanteria() {
    console.log(this.estanteriaSeleccionada);
    console.log(this.solosinasignar);
    this.getLocaciones();
  }

  confirmo() {
    console.log(this.listLocaciones);
    const locas: Locacion[] = [];
    for (const ll of this.listLocaciones) {
      if (ll.checked) {
        locas.push(ll.locacion);
      }
    }
    if (locas.length > 0) {
      this.teAsigno(locas);
    } else {
      this.ref.close('NOELIGIO');
    }
  }

  teAsigno(locas: Locacion[]) {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.depo.erpCode;
    let arrplanos: Plano[] = [];
    let elplano = new Plano();
    elplano.planoId = this.plano.planoId;
    const lospuntos: PuntoPlano[] = [];
    let pp = new PuntoPlano();
    pp.puntoId = this.punto.puntoId;
    pp.locaciones = locas;
    lospuntos.push(pp);
    elplano.puntos = lospuntos;
    arrplanos.push(elplano);
    eldep.planos = arrplanos;
    miroot.deposito = eldep;

    this.matser.asignoLocacionesAPunto(miroot).subscribe(
      resu => {
        if (resu.error) {
          this.ref.close('MAL');
        } else {
          this.ref.close('OK');
        }
      }, error => {
        console.log(error)
        this.ref.close('MAL');
      }
    );
  }

  onChangeCheck(evt: any, loca: LocaCheck) {
    console.log(evt);
    loca.checked = evt.checked;
    console.log(loca);
  }

  volver() {
    this.ref.close('CANCEL');
  }
}
