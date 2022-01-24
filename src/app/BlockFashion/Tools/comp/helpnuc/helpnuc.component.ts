import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import pageSettings from '../../../../config/page-settings';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';

@Component({
  selector: 'app-helpnuc',
  templateUrl: './helpnuc.component.html',
  styleUrls: ['./helpnuc.component.css']
})
export class HelpnucComponent implements OnInit, OnDestroy  {
  //@Input() atributo: Atributo;
  @Output() nucleoChange = new EventEmitter();
  @Output() winNChange = new EventEmitter();
  @Output() winNClose = new EventEmitter();

  pageSettings = pageSettings;
  objNuc = new Nucleo();
  swaltit: string;
  swalmsg: string;
  valorbol: boolean;
  lista: Nucleo[];
  idNucleo = '';

  constructor(private nucsrv: NucleosService) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.objNuc = null;
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.nucsrv.getNucleosActivos().subscribe(
      resnuc => {
        this.lista = resnuc;
        Swal.close();
      }
    );
  }

  elijo(elitem){
    console.log(elitem);
    const nucleo = elitem;
    this.objNuc = elitem;
    this.idNucleo = nucleo.id;
    this.nucleoChange.emit(this.objNuc);
    this.winNChange.emit('');
    this.d('saven');
  }

  d(conc){
    this.winNClose.emit('');
  }


}
