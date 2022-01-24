import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { MovCont } from '../../models/movcont';
import { Via } from '../../../Admin/models/via';
import { MovcontService } from '../../serv/movcont.service';
import { ViapagoService } from '../../../Admin/services/viapago.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gasto-lista',
  templateUrl: './gasto-lista.component.html',
  styleUrls: ['./gasto-lista.component.css']
})
export class GastoListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: MovCont[];
  objMov: MovCont;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';

  fecini = '';
  fecfin = '';
  varsOpcion: Via[];
  lavia: Via = new Via();


  constructor(
    private movsrv: MovcontService,
    private viasrv: ViapagoService,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd',"en-US");
    this.fecfin = this.fecini;
    let lavia: Via = new Via();
    lavia.nombre = 'Todas los vías de pago';
    lavia.id = 0;
    this.varsOpcion = [];
    this.varsOpcion.push(lavia);
    this.viasrv.getVias().subscribe(
      restip => {
        for (const otipo of restip) {
          this.varsOpcion.push(otipo);
        }
        this.lavia = this.varsOpcion[0];
        this.getOrigen();
      }
    );
  }

  getOrigen() {
    sessionStorage.removeItem('gasto_viaId');
    sessionStorage.removeItem('gasto_fecha');
    sessionStorage.removeItem('gasto_desc');
    sessionStorage.removeItem('gasto_refe');
    sessionStorage.removeItem('gasto_movId');
    sessionStorage.removeItem('gasto_pagoId');

    let pepe = '';
    pepe = sessionStorage.getItem('listagas_via');
    if (pepe != null && pepe != undefined){
      for (const vivi of this.varsOpcion){
        if (vivi.id == parseInt(pepe,10)){
          this.lavia = vivi;
          break;
        }
      }
    }

    let pepi = '';
    pepi = sessionStorage.getItem('listagas_feci');
    if (pepi != null && pepi != undefined){
      this.fecini = pepi;
    }

    let pepf = '';
    pepf = sessionStorage.getItem('listagas_fecf');
    if (pepf != null && pepf != undefined){
      this.fecfin = pepf;
    }
    this.cargo();

  }

  cargo() {
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.lista = [];
    sessionStorage.setItem('listagas_via', this.lavia.id.toString());
    sessionStorage.setItem('listagas_feci', this.fecini);
    sessionStorage.setItem('listagas_fecf', this.fecfin);
    if (this.lavia.id === 0) {
      this.movsrv.getMovs(this.fecini, this.fecfin, 'G', 'G').subscribe(
        resmon => {
          this.lista = resmon;
          Swal.close();
        }
      );
    } else {
      sessionStorage.setItem('gasto_viaId',this.lavia.id.toString());
      this.movsrv.getMovsVia(this.fecini, this.fecfin, this.lavia.id.toString(), 'G', 'G').subscribe(
        resmon => {
          this.lista = resmon;
          Swal.close();
        }
      );
    }
  }


  onChangeTipo(uno){
    for (const pipi of this.varsOpcion){
      if (uno.trim() === pipi.nombre.trim()) {
        this.lavia = pipi;
        if (this.lavia.id == 0){
          sessionStorage.removeItem('gasto_viaId');
        } else {
          sessionStorage.setItem('gasto_viaId',this.lavia.id.toString());
        }
        break;
      }
    }
  }
  exportExcel() {}

  inhab(idRec) {
    this.swaltit = '¿Desea eliminar el gasto?';
    this.swalmsg = 'El gasto será eliminado de la base de datos';
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idRec);
      }
    });

  }


  teborro(idRec) {
    this.movsrv.deleteMovcont(idRec).subscribe(
      resu => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Evento eliminado correctamente';
            Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'success',
              confirmButtonText: 'OK',
            });
            this.ngOnInit();
          },
            error => {
              this.swaltit = 'Error';
              this.swalmsg = 'No se pudo eliminar el registro';
              Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'error',
                confirmButtonText: 'OK',
              });
          }
        );
  }
}
