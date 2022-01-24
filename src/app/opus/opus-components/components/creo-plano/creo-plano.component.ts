import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NgForm } from '@angular/forms';
import { Deposito } from '../../models/deposito';
import { DepositoRoot } from '../../models/deposito-root';
import { Plano } from '../../models/plano';
import { StorageCds } from '../../models/storage-cds';
import { MatricerosService } from '../../services/matriceros.service';


@Component({
  selector: 'app-creo-plano',
  templateUrl: './creo-plano.component.html',
  styleUrls: ['./creo-plano.component.scss']
})
export class CreoPlanoComponent implements OnInit {

  planos: Plano[] = [];
  depo!: StorageCds;
  descripcion = '';
  hayError = false;
  modo = '';
  plano!: Plano;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private matser: MatricerosService) { }

  ngOnInit() {
    console.log(this.config);
    this.planos = this.config.data.planos;
    this.depo = this.config.data.depo;
    this.modo = this.config.data.modo;
    this.plano = this.config.data.planoId;
    if (this.modo == 'M') {
      this.descripcion = this.plano.planoDsc;
    }
  }

  closemodal() {
    this.ref.close('NN');
  }

  creoPlano(f: NgForm) {
    if (f.valid) {
      let miroot = new DepositoRoot();
      let eldep = new Deposito();
      eldep.depId = this.depo.erpCode;
      let arrplanos: Plano[] = [];
      let elplano = new Plano();
      if (this.modo == 'M') {
        elplano.planoId = this.plano.planoId;
        elplano.planoDsc = this.descripcion;
        elplano.planoOrd = this.plano.planoOrd;
      } else {
        elplano.planoDsc = this.descripcion;
        elplano.planoOrd = this.getorden();
      }

      arrplanos.push(elplano);
      eldep.planos = arrplanos;
      miroot.deposito = eldep;

    this.matser.setPlano(miroot).subscribe(
      resu => {
        console.log('Resultado de crear');
        console.log(resu);
        if (resu.error) {
          this.ref.close('MAL');
          } else {
            this.ref.close('OK');
          }
        }, error => {
          this.ref.close('MAL');
        }
      );
    } else {
      this.hayError = true;
      setTimeout(() => {
        this.hayError = false;
      }, 3000);
    }
  }

  getorden(): number {
    let orden = 0;

    for (const ss of this.planos) {
      if (ss.planoOrd > orden) {
        orden = ss.planoOrd;
      }
    }

    return orden + 1;
  }

}
