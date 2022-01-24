import { Component, OnInit } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Afiliadoindi } from '../../../Afiliados/models/afiliadoindi';
import { Dato } from '../../../Admin/models/dato';
import { Usuario } from '../../../Admin/models/usuario';
import { MovcontService } from '../../serv/movcont.service';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { DatosService } from '../../../Admin/services/datos.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-rec-afiliado',
  templateUrl: './rec-afiliado.component.html',
  styleUrls: ['./rec-afiliado.component.css']
})
export class RecAfiliadoComponent implements OnInit {

  pageSettings = pageSettings;
  lista: Afiliadoindi[];
  objDato: Dato;
  filtro = true;
  buscar = '';
  nivel = 0;
  elusu: Usuario = new Usuario();

  swaltit = '';
  swalmsg = '';
  swaldos = '';
  swalget = '';
  fecini = '';


  constructor(
    private movsrv: MovcontService,
    private excsrv: ExceljsService,
    private logsrv: LoginService,
    private datsrv: DatosService) {
    this.pageSettings.pageWithFooter = true;
   }

  ngOnInit() {
    this.fecini = formatDate(new Date(), 'yyyy-MM-dd', "en-US");
    console.log("te lo pongo");
    console.log(this.fecini);
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();
    this.lista = [];
    this.cargoRecibosIndividuales();
  }

  cargoRecibosIndividuales() {
    console.log("Ahi te va");
    console.log(this.fecini);

    Swal.fire({
      title: 'Cargando recibos individuales ... puede demorar un buen rato esto',
    });
    Swal.showLoading();

    this.movsrv.getPagoIndividual(this.fecini).subscribe(
      resu => {
        console.log("me llega");
        console.log(resu);
        this.lista = resu;
        Swal.close();
      }
    );

  }


  exportExcel(): void {
    const lisXls = [];
    for (let i = 0; i < this.lista.length; i++) {

      lisXls.push([
        this.lista[i].cedula ,
        this.lista[i].nombre ,
        this.lista[i].recibo_num ,
        this.lista[i].recibo_fec,
        this.lista[i].recibo_imp ,
        this.lista[i].recibo_pag,
        this.lista[i].recibo_obs,
        this.lista[i].telefono,
        this.lista[i].depto,
        this.lista[i].ciudad,
      ]);
    }

    const pHeader = ["Cedula","Nombre","Recibo","Fecha","Importe","Ult.Pago","Notas","Telefono","Departamento","Ciudad"];
    const pCol = [10, 40,10,15,15,15,40,20,20,20];
    const pTit = 'Listado de Pagos individuales';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }

}
