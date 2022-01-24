import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SesionEnvio } from '../../../models/sesion-envio';
import { SesionEnvioHead } from '../../../models/sesion-envio-head';
import { SesionesEnvioService } from '../../../services/sesiones-envio.service';

@Component({
  selector: 'app-detalle-envio',
  templateUrl: './detalle-envio.component.html',
  styleUrls: ['./detalle-envio.component.scss']
})
export class DetalleEnvioComponent implements OnInit {

  @Input() sesion!: SesionEnvioHead;

  lasesion: SesionEnvio = new SesionEnvio();
  lafe = '';
  cierre = '';
  operador = '';
  ageid = '';
  agedsc = '';

  constructor(private seser: SesionesEnvioService) { }

  ngOnInit() {
    this.seser.findSesionById(this.sesion.id).subscribe(
      resu => {
        console.log(resu);
        this.lasesion = resu;
        this.lafe = formatDate(this.lasesion.creationDate, 'dd/MM/YYYY',"en-US");
        if (this.lasesion.finishDate != null) {
          this.cierre = formatDate(this.lasesion.finishDate, 'dd/MM/YYYY',"en-US");
        }
        this.operador = this.lasesion.operator.operatorDsc;
        if (this.lasesion.forwarderId != null) {
          this.ageid = this.lasesion.forwarderId;
        }
        if (this.lasesion.forwarderDsc != null) {
          this.agedsc = this.lasesion.forwarderDsc;
        }
      }, error => {
        console.log(error);
      }
    );
  }

}
