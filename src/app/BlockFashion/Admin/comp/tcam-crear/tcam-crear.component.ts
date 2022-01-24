import { Component, OnInit } from '@angular/core';
import { Moneda } from '../../models/moneda';
import { Tcam } from '../../models/tcam';
import { ActivatedRoute, Router } from '@angular/router';
import { MonedaService } from '../../services/moneda.service';
import { TcamService } from '../../services/tcam.service';
import { formatDate, Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';


@Component({
  selector: 'app-tcam-crear',
  templateUrl: './tcam-crear.component.html',
  styleUrls: ['./tcam-crear.component.css']
})
export class TcamCrearComponent implements OnInit {
  lamon: Moneda;
  objTC = new Tcam();
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
    // other options are here...
  };
  model: IMyDateModel = null;

  constructor(private actRout: ActivatedRoute,
    private monsrv: MonedaService,
    private tcsrv: TcamService,
    private _location: Location,
    private router: Router) { }

  ngOnInit() {
    this.actRout.paramMap.subscribe(
      params => {
        let idMon = params.get('idMon');
        this.monsrv.getMoneda(idMon).subscribe(
          resu => {
            this.lamon = resu;
            this.model = {isRange: false, singleDate: {jsDate: new Date()}};
            this.objTC.mon = this.lamon
            this.objTC.fecha = this.model.singleDate.jsDate;

            const lafec = formatDate(this.objTC.fecha, "yyyy-MM-dd","en-US");
            this.tcsrv.getTCByMonFec(this.lamon.id, lafec).subscribe(
              resu => {
                this.objTC.valor = resu.valor;
              });
          }
        );
      }
    );

  }

  creoTC(f: NgForm) {
    this.controlo();
  }

  controlo(){
    this.objTC.fecha = this.model.singleDate.jsDate;
    const lafec = formatDate(this.objTC.fecha, "yyyy-MM-dd","en-US");
    const micambio: number = this.objTC.valor;
    this.tcsrv.getTCByMonFec(this.lamon.id, lafec).subscribe(
      resu => {
        const fec1 = formatDate(this.objTC.fecha, "yyyy-MM-dd","en-US");
        const fec2 = formatDate(resu.fecha, "yyyy-MM-dd","en-US");

        if (fec1 === fec2 && resu.valor !== 1) {
          Swal.fire({
            title: 'Atención!',
            text: 'El tipo de cambio ya existe para esa fecha: ' + resu.valor.toString(),
            type: 'warning',
            confirmButtonText: 'OK',
            
          });
        } else {
          if (micambio === 0) {
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
      }
    );
  }


  tecreo() {
    this.tcsrv.saveTC(this.objTC).subscribe(
      resul => {
        Swal.fire({
          title: 'Exito!',
          text: 'Tipo de cambio creado correctamente',
          type: 'success',
          confirmButtonText: 'OK',
        });
        this._location.back();
        //this.router.navigate([LASTPAGE]);
        //this.router.navigate(['/tcam-lista',this.lamon.id]);

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

