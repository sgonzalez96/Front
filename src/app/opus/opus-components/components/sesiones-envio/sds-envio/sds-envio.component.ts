import { Component, OnInit, Input } from '@angular/core';
import { SesionEnvio } from '../../../models/sesion-envio';
import { SesionEnvioHead } from '../../../models/sesion-envio-head';
import { SesionEnvioSD } from '../../../models/sesion-envio-sd';
import { SesionesEnvioService } from '../../../services/sesiones-envio.service';


@Component({
  selector: 'app-sds-envio',
  templateUrl: './sds-envio.component.html',
  styleUrls: ['./sds-envio.component.scss']
})
export class SdsEnvioComponent implements OnInit {

  @Input() sesion!: SesionEnvioHead;

  lasesion: SesionEnvio = new SesionEnvio();
  listSD: SesionEnvioSD[] = [];

  constructor(private seser: SesionesEnvioService) { }

  ngOnInit() {
    this.seser.findSesionById(this.sesion.id).subscribe(
      resu => {
        console.log(resu);
        this.lasesion = resu;
        this.listSD = this.lasesion.listSD;
      }, error => {
        console.log(error);
      }
    );
  }

}
