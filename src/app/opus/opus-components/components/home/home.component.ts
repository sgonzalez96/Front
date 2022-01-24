import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatricerosService } from '../../services/matriceros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cantOperarios = 0;
  cantDispo = 0;
  cantDepos = 0;
  cantTiposCarga = 0;
  cantTiposEstanterias = 0;
  cantPuntosPicking = 0;

  constructor(private matser: MatricerosService, private router: Router) { }

  ngOnInit() {
    this.matser.getOperators().subscribe(
      resu => {
        this.cantOperarios = resu.length;
      }
    );

    this.matser.getDevices().subscribe(
      resu => {
        this.cantDispo = resu.length;
      }
    );

    this.matser.getStorages().subscribe(
      resu => {
        this.cantDepos = resu.length;
      }
    );

    this.matser.getTiposDeCarga().subscribe(
      resu => {
        this.cantTiposCarga = resu.object.length;
      }
    );

    this.matser.getPuntosPicking().subscribe(
      resu => {
        this.cantPuntosPicking = resu.object.length;
      }
    );

    this.matser.getTiposDeEstanteria().subscribe(
      resu => {
        this.cantTiposEstanterias = resu.object.length;
      }
    );
  }

  irMenu(ruta: string) {
    this.router.navigate(['/' + ruta]);
  }

}
