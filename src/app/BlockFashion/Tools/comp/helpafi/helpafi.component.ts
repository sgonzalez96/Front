import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { AfilNucleo } from '../../../Afiliados/models/afilnuc';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-helpafi',
  templateUrl: './helpafi.component.html',
  styleUrls: ['./helpafi.component.css']
})
export class HelpafiComponent implements OnInit, OnDestroy  {
  @Input() nucleo: Nucleo;
  @Output() afiliadoChange = new EventEmitter();
  @Output() winAChange = new EventEmitter();
  @Output() winAClose = new EventEmitter();

  pageSettings = pageSettings;
  objAfi = new Afiliado();
  swaltit: string;
  swalmsg: string;
  valorbol: boolean;
  listanu: AfilNucleo[];
  lista: Afiliado[];
  idAfi = '';
  objAfilNuc: AfilNucleo;

  constructor(private afisrv: AfiliadosService) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    console.log("me llega");
    console.log(this.nucleo);
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.objAfi = null;
    this.lista = [];
    if (this.nucleo == null || this.nucleo.id === 0 ) {
      this.afisrv.getAfiliados('false', '').subscribe(
        resafi => {
          this.lista = resafi;
          Swal.close();
        }
      );
    } else {
      console.log("vamosnos");
      this.afisrv.getAfiNucleo(this.nucleo.id.toString()).subscribe(
        resnuc => {

          this.listanu = resnuc;
          console.log(this.listanu);
          for (const afinuc of this.listanu) {
            this.lista.push(afinuc.afiliado);
          }
          Swal.close();
        }, error=> {
          console.log(error);
        }
      );
    }

  }

  elijo(elitem){
    console.log(elitem);
    this.objAfi = elitem;
    this.idAfi = this.objAfi.cedula;
    this.afiliadoChange.emit(this.objAfi);
    this.winAChange.emit('');
    this.d('saven');
  }

  d(conc){
    this.winAClose.emit('');
  }


}
