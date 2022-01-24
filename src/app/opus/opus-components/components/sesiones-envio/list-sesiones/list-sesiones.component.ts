import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SesionEnvioHead } from '../../../models/sesion-envio-head';
import { StorageCds } from '../../../models/storage-cds';
import { MatricerosService } from '../../../services/matriceros.service';
import { NotiService } from '../../../services/noti.service';
import { SesionesEnvioService } from '../../../services/sesiones-envio.service';

interface Pdrop {
  id: string;
  dsc: string;
}

@Component({
  selector: 'app-list-sesiones',
  templateUrl: './list-sesiones.component.html',
  styleUrls: ['./list-sesiones.component.scss']
})
export class ListSesionesComponent implements OnInit {

  @ViewChild('dialogDetalle', {static: false}) dialogDetalle!: TemplateRef<NgbModal>;
  @ViewChild('dialogPaquetes', {static: false}) dialogPaquetes!: TemplateRef<NgbModal>;
  @ViewChild('dialogSD', {static: false}) dialogSD!: TemplateRef<NgbModal>;

  modalRefDeta!: NgbModalRef;
  modalRefPaque!: NgbModalRef;
  modalRefSD!: NgbModalRef;

  depositos: StorageCds[] = [];
  estados: Pdrop[] = [];
  selectedEstado!: Pdrop;
  losdepos: Pdrop[] = [];
  selectedDepo!: Pdrop;
  sesiones: SesionEnvioHead[] = [];
  feci: string= "";
  fecf: string= "";
  selectedSesion!: SesionEnvioHead;

  constructor(private matser: MatricerosService, private enviser: SesionesEnvioService, private notiser: NotiService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.feci = formatDate(new Date(), 'YYYY-MM-dd',"en-US");
    this.fecf = formatDate(new Date(), 'YYYY-MM-dd',"en-US");
    this.cargoDepositos();
    this.cargoEstados();
  }

  cargoEstados() {
    this.estados = [];
    this.estados.push({id: 'L', dsc: 'Libres'});
    this.estados.push({id: 'P', dsc: 'En proceso'});
    this.estados.push({id: 'T', dsc: 'Terminadas'});
    this.estados.push({id: '*', dsc: 'Todas'});
    this.selectedEstado = {id: 'L', dsc: 'Libres'};
  }

  cargoDepositos() {
    this.depositos = [];
    this.losdepos = [];
    this.matser.getStorages().subscribe(
      resu => {
        console.log('los depositos son');
        console.log(resu);
        this.depositos = resu;
        for (let depo of this.depositos) {
          this.losdepos.push({id: depo.storageId.toString(), dsc: depo.erpCode + ' - ' + depo.storageDsc});
        }
        if (this.losdepos != null && this.losdepos != undefined && this.losdepos.length > 0) {
          this.selectedDepo = this.losdepos[0];
        } else {
          this.selectedDepo = {id: '*', dsc: 'Error'};
        }
      }, error => {
        console.log(error);
        this.notiser.notiError('Error al cargar los depósitos');
      }
    );
  }

  cargoData() {
    this.sesiones = [];
    this.enviser.getSesionesEnvio(this.feci, this.fecf, this.selectedEstado.id, '', '', +this.selectedDepo.id).subscribe(
      resu => {
        console.log(resu);
        this.sesiones = resu;
      }, error => {
        console.log(error);
        this.notiser.notiError('Error al cargar las sesiones de envío');
      }
    );
  }

  verSD(item: SesionEnvioHead) {
    console.log('en ver SD');
    console.log(item);
    this.selectedSesion = item;
    this.modalRefSD = this.modalService.open(this.dialogSD, {backdrop: 'static', size: 'lg', keyboard: false, centered: true});
  }

  detalle(item: SesionEnvioHead) {
    console.log('en detalle');
    console.log(item);
    this.selectedSesion = item;
    this.modalRefDeta = this.modalService.open(this.dialogDetalle, {backdrop: 'static', size: 'lg', keyboard: false, centered: true});
  }

  paquetes(item: SesionEnvioHead) {
    console.log('en paquetes');
    console.log(item);
    this.selectedSesion = item;
    this.modalRefPaque = this.modalService.open(this.dialogPaquetes, {backdrop: 'static', size: 'lg', keyboard: false, centered: true});
  }
}
