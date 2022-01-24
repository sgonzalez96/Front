import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import pageSettings from '../../../../config/page-settings';
import { Mensaje } from '../../models/mensaje';
import { MensajeService } from '../../serv/mensaje.service';
import { ExceljsService } from '../../serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';

@Component({
  selector: 'app-vermensajes',
  templateUrl: './vermensajes.component.html',
  styleUrls: ['./vermensajes.component.css']
})

export class VermensajesComponent implements OnInit{
  pageSettings = pageSettings;
  lista: Mensaje[];
  listop: Opiti[];
  lista_modos: string[];

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  objDato: Dato = new Dato();


  constructor(
    private mensrv: MensajeService,
    private excsrv: ExceljsService,
    private datsrv: DatosService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.lista = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.listop =  [];

    const opitingui = new Opiti();
    opitingui.codigo = 'US01';
    opitingui.descripcion = 'Control de usuarios sin afiliados';
    opitingui.activo = true;
    opitingui.uso = 'Controla que todos los usuarios del sistema tengan si ficha de afiliado en correcto estado';
    this.listop.push(opitingui);

    const opitingui2 = new Opiti();
    opitingui2.codigo = 'AF01';
    opitingui2.descripcion = 'Control de afiliados';
    opitingui2.activo = true;
    opitingui2.uso = 'Controla que los afiliados tengan nucleos, y al menos uno cotizante';
    this.listop.push(opitingui2);

    const opitingui3 = new Opiti();
    opitingui3.codigo = 'NU01';
    opitingui3.descripcion = 'Control de nucleos';
    opitingui3.activo = false;
    opitingui3.uso = 'Controla que los nucleos tengan delegado principal y suplente';
    this.listop.push(opitingui3);


    //this.cargo();
  }

  cargo() {
    Swal.fire({
      title:  'Obteniendo datos ... '
    });
    Swal.showLoading();

    this.lista = [];
    this.lista_modos = [];
    for (const opi of this.listop) {
        if (opi.activo) {
          this.lista_modos.push(opi.codigo);
        }
    }

    this.mensrv.getMensajes(this.lista_modos).subscribe(
      resmon => {
        this.lista = resmon;
        Swal.close();
      }
    );
  }

  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {
      lisXls.push([
        this.lista[i].id ,
        this.lista[i].codigo,
        this.lista[i].mensaje ,
        this.lista[i].entidad,
        this.lista[i].key ,
        this.lista[i].notas,
      ]);
    }

    const pHeader = ["Id","Codigo","Mensaje","Entidad","Identificador","Notas"];
    const pCol = [10, 10,30,10,20,50];
    const pTit = 'Listado de Mensajes de Integridad';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

  cambio(indi){
    let mindi = 0;
    mindi = indi;
    console.log("que tein"  );
    console.log(this.listop[mindi]);
    //for (let i = 0; i < this.listamov.length; i++){
    //  if (i != mindi) {
    //    this.listamov[i].selected = false;
    //}
  }

}

export class Opiti {
  codigo: string;
  descripcion: string;
  activo: boolean;
  uso: string;
}
