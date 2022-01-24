import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Moneda } from '../../models/moneda';
import { MonedaService } from '../../services/moneda.service';
import { LoginService } from '../../../Tools/serv/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mon-lista',
  templateUrl: './mon-lista.component.html',
  styleUrls: ['./mon-lista.component.css']
})
export class MonListaComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Moneda[];
  objMon: Moneda;

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  
  
  constructor(
    private monsrv: MonedaService,
    private logsrv: LoginService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.monsrv.getMonedas().subscribe(
      resmon => {
        this.lista = resmon;
      }
    );

  }

  exportExcel() {}

  baja_mon(idMon) {

    this.swaltit = '¿Desea eliminar la moneda?';                   
    this.swalmsg = 'La moneda será eliminada de la base de datos'; 
    this.swaldos = 'Cancelar';                                     
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.teborro(idMon);
      }
    });

  }


  teborro(idMon) {
    this.monsrv.getMoneda(idMon).subscribe(
      resu => {
        this.objMon = resu;
        this.monsrv.deleteMoneda(idMon).subscribe(
          resul => {
            this.swaltit = 'Ok';
            this.swalmsg = 'Moneda eliminada correctamente';
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
    );
  }
}
