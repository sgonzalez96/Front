import { Component, OnInit } from '@angular/core';
import { TipoAct } from '../../models/tipoact';
import pageSettings from '../../../../config/page-settings';
import { EventosService } from '../../serv/eventos.service';
import { TipoactService } from '../../serv/tipoact.service';
import { Invitacion } from '../../models/invitacion';
import { LoginService } from '../../../Tools/serv/login.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-eventos-usu',
  templateUrl: './eventos-usu.component.html',
  styleUrls: ['./eventos-usu.component.css']
})
export class EventosUsuComponent implements OnInit {

  pageSettings = pageSettings;
  idAfil = '';
  objAfil = new Afiliado();

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  varsOpcion: TipoAct[];
  eltipo: TipoAct;
  lista: Invitacion[];
  closeResult = '';

  constructor(
    private evesrv: EventosService,
    private tipsrv: TipoactService,
    private afisrv: AfiliadosService,
    private modalservice: NgbModal,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.fecfin = this.fecini;
    if (sessionStorage.getItem('usuevelista_tipo') != null &&
        sessionStorage.getItem('usuevelista_tipo') !== undefined) {
        this.fecini = sessionStorage.getItem('usuevelista_feci');
        this.fecfin = sessionStorage.getItem('usuevelista_fecf');
        this.idAfil = sessionStorage.getItem('usuevelista_afil');
    }

    const mitipo: TipoAct = new TipoAct();
    mitipo.descripcion = 'Todos los eventos';
    mitipo.id = 0;
    this.varsOpcion = [];
    this.varsOpcion.push(mitipo);
    this.eltipo = this.varsOpcion[0];
    this.tipsrv.getTipoActividades().subscribe(
      restip => {
        for (const otipo of restip) {
          this.varsOpcion.push(otipo);
          if (sessionStorage.getItem('usuevelista_tipo') != null &&
              sessionStorage.getItem('usuevelista_tipo') !== undefined) {
                if (sessionStorage.getItem('usuevelista_tipo') === otipo.id.toString()) {
                  this.eltipo = otipo;
                }
          }
        }
      }
    );


  }

  cargo() {
    sessionStorage.setItem('usuevelista_feci', this.fecini);
    sessionStorage.setItem('usuevelista_fecf', this.fecfin);
    sessionStorage.setItem('usuevelista_tipo', this.eltipo.id.toString());
    sessionStorage.setItem('usuevelista_afil', this.idAfil.toString());
    this.evesrv.getInvUsu(this.idAfil.toString()).subscribe(
       resmon => {
         this.lista = resmon;
       }
    );
  }

  cambioId(mellega) {
    this.idAfil = mellega;
      // @todo valido que sean numeros
      if (this.idAfil === undefined ||
        this.idAfil === null ||
        this.idAfil.trim() === '' ) {
        this.swaltit = 'Atención';
        this.swalmsg = 'La cédula no puede ser vacía';
        Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
      this.afisrv.getAfiliado(this.idAfil.trim()).subscribe(
        resafi => {
          if (resafi != null && resafi !== undefined) {
            this.objAfil = resafi;
          } else  {
            this.swaltit = 'Atención';
            this.swalmsg = 'Cédula inexistente en el padrón';
            Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'warning',
              confirmButtonText: 'OK',
            });
          }

        }, error => {
          this.swaltit = 'Atención';
          this.swalmsg = 'Error al leer la cédula';
          Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      );
  }

  onChangeTipo(uno) {
    for (const pipi of this.varsOpcion) {
      if (uno.trim() === pipi.descripcion.trim()) {
        this.eltipo = pipi;
        break;
      }
    }
    console.log(this.eltipo);
  }

  exportExcel() {}

  // Manejo del Log
  // nuc_open(content) {
  //   this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;

  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   }

  //   private getDismissReason(reason: any): string {
  //     if (reason === ModalDismissReasons.ESC) {
  //       return 'by pressing ESC';
  //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //       return 'by clicking on a backdrop';
  //     } else {
  //       return  `with: ${reason}`;
  //     }
  //   }

  // cierro_res() {
  //     this.resultado = false;
  //     this.pido_csv = false;
  //     this.disp_cam = false;
  // }

}
