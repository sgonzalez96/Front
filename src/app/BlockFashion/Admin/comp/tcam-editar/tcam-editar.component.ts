import { Component, OnInit } from '@angular/core';
import { Moneda } from '../../models/moneda';
import { Tcam } from '../../models/tcam';
import { MonedaService } from '../../services/moneda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TcamService } from '../../services/tcam.service';
import { Location, formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tcam-editar',
  templateUrl: './tcam-editar.component.html',
  styleUrls: ['./tcam-editar.component.css']
})
export class TcamEditarComponent implements OnInit {
  lamon: Moneda;
  objTC = new Tcam();
  lafec: string;

  constructor(private actRout: ActivatedRoute,
    private monsrv: MonedaService,
    private tcsrv: TcamService,
    private router: Router,
    private _location: Location) { }

  ngOnInit() {
    this.actRout.paramMap.subscribe(
      params => {
        let idTC = params.get('idTC');
        this.tcsrv.getTC(idTC).subscribe(
          resu => {
            this.objTC = resu;
            this.lamon = resu.mon;
            this.lafec = formatDate(this.objTC.fecha, "dd/MM/yyyy","en-US");
          }
        );
      }
    );
  }

  creoTC(f: NgForm) {
    this.controlo();
  }

  controlo(){
    if (this.objTC.valor === 0) {
      Swal.fire({
        title: 'Atención!',
        text: 'El valor no puede estar en cero o nulo ' ,
        type: 'warning',
        confirmButtonText: 'OK',
        });
    } else {
      this.tecreo();
    }
  }


  tecreo() {
    this.tcsrv.saveTC(this.objTC).subscribe(
      resul => {
        Swal.fire({
          title: 'Exito!',
          text: 'Tipo de cambio modificado correctamente',
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/tcam-lista',this.lamon.id]);

        },
        error => {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo crear el tipo de cambio',
            type: 'error',
            confirmButtonText: 'OK',
        
          });
        }
    );
  }

  volver() {
    this._location.back();
  }

}
