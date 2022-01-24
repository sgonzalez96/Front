import { Component, OnInit, Input } from '@angular/core';
import { PaqueteEnvio } from '../../../models/paquete-envio';
import { SesionEnvio } from '../../../models/sesion-envio';
import { SesionEnvioHead } from '../../../models/sesion-envio-head';
import { SesionesEnvioService } from '../../../services/sesiones-envio.service';


@Component({
  selector: 'app-paquetes-envio',
  templateUrl: './paquetes-envio.component.html',
  styleUrls: ['./paquetes-envio.component.scss']
})
export class PaquetesEnvioComponent implements OnInit {

  @Input() sesion!: SesionEnvioHead;

  lasesion: SesionEnvio = new SesionEnvio();
  paquetes: PaqueteEnvio[] = [];

  constructor(private seser: SesionesEnvioService) { }

  ngOnInit() {
    this.seser.findSesionById(this.sesion.id).subscribe(
      resu => {
        console.log(resu);
        this.lasesion = resu;
        this.paquetes = this.lasesion.packages;
      }, error => {
        console.log(error);
      }
    );
  }

}
