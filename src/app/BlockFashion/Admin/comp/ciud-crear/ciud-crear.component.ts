import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Ciudad } from '../../models/ciudad';
import { CiudadService } from '../../services/ciudad.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Deptos } from '../../models/depto';

@Component({
  selector: 'app-ciud-crear',
  templateUrl: './ciud-crear.component.html',
  styleUrls: ['./ciud-crear.component.css']
})
export class CiudCrearComponent implements OnInit, OnDestroy {
  @Output() ciudadChange = new EventEmitter();
  @Output() winChange = new EventEmitter();
  @Output() winClose = new EventEmitter();

  pageSettings = pageSettings;
  objCiud = new Ciudad();
  swaltit: string;
  swalmsg: string;
  varsDep: Deptos[];
  elDep: Deptos;

  constructor(private ciudsrv: CiudadService,
              private actRout: ActivatedRoute,
              private _location: Location) {

   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.ciudsrv.getDeptos().subscribe(
      resdep => {
        this.varsDep = resdep;
        this.elDep = this.varsDep[0];
        this.ciudsrv.getDepto(this.actRout.snapshot.params['idDep'].toString()).subscribe(
          resu => {
            this.objCiud.dep = resu;
          }, error => {
            this.objCiud.dep = this.elDep;
          }
        );
      }
    );
  }


  creoCiud(f: NgForm) {
    if (this.objCiud.nombre == null || this.objCiud.nombre === '') {
      this.swaltit = 'Atención';
      this.swalmsg = 'Debe ingresar una descripción';
      Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    this.ciudsrv.saveCiudad(this.objCiud).subscribe(

      resul => {
        this.swaltit = 'Ok';
        this.swalmsg = 'La ciudad fue creada correctamente';
        Swal.fire({
          title: this.swaltit,
          text: this.swalmsg,
          type: 'success',
          confirmButtonText: 'OK',
        });
        this.ciudadChange.emit(resul);
        this.winChange.emit('');
        //this.volver();
        },
        error => {
          this.swaltit = 'Error!';
          this.swalmsg = 'Error al crear la ciudad';
          Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'error',
            confirmButtonText: 'OK',
          });
        }
    );
  }

  onChangeDep(eldepo) {
    for (const dep of this.varsDep){
      if (eldepo.trim() === dep.nombre.trim()) {
        this.elDep = dep;
        this.objCiud.dep = this.elDep;
        break;
      }
    }
  }

  d(conc){
    this.winClose.emit('');
  }
}
