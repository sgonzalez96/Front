import { AfilProdDTO } from './../../../Afiliados/models/AfilProdDTO';
import { AfiliadosService } from './../../../Afiliados/serv/afiliados.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { Dato } from '../../../Admin/models/dato';
import { DatosService } from '../../../Admin/services/datos.service';



@Component({
  selector: 'app-ver-product',
  templateUrl: './ver-product.component.html',
  styleUrls: ['./ver-product.component.css']
})
export class VerProductComponent implements OnInit {

  lista: AfilProdDTO[] = [];
  objDato: Dato;


  constructor(private _afil: AfiliadosService, private excsrv: ExceljsService, private datsrv: DatosService) { }


  ngOnInit() {
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );


  }
  cargandoProductos() {
    Swal.fire({
      title: 'Obteniendo datos ... '
    });
    Swal.showLoading();
    this._afil.getListAfilProdDTO(0).subscribe(
      resdele => {
        this.lista = resdele
        Swal.close();
      }
    )

  }

  createExcel(): void {
    const listaXls = [];

    for (let i = 0; i < this.lista.length; i++) {
      let cedu = '';
      if (this.lista[i].cedula != null && this.lista[i].cedula !== undefined) {
        cedu = this.lista[i].cedula;
      }

      let apell = "";
      if (this.lista[i].apellidos != null && this.lista[i].apellidos !== undefined) {
        apell = this.lista[i].apellidos;
      }

      let name = "";
      if (this.lista[i].nombres != null && this.lista[i].nombres !== undefined) {
        name = this.lista[i].nombres;
      }

      let nucId = '';
      if (this.lista[i].nucleoId != null && this.lista[i].nucleoId !== undefined) {
        nucId = this.lista[i].nucleoId;
      }

      let nucNomb = '';
      if (this.lista[i].nucleoNombre != null && this.lista[i].nucleoNombre !== undefined) {
        nucNomb = this.lista[i].nucleoNombre;
      }

      let prod = '';
      if (this.lista[i].producto != null && this.lista[i].producto !== undefined) {
        prod = this.lista[i].producto;
      }


      listaXls.push([
        cedu,
        name + ' ' + apell,
        nucId,
        nucNomb,
        this.lista[i].enable,
        prod,
        this.lista[i].fechaAsig,
        this.lista[i].caracteristicas,
      ]);
    }

    const pHeader = ["Cedula", "Nombres", "Nucleo", "Institución", "Activo", "Producto", "Fecha Asig", "Caracteristicas"];
    const pCol = [10, 40, 10, 40, 10, 20, 20,
      20];
    const pTit = 'Lista de productos solicitados';
    const pSubtit = '';
    this.excsrv.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, listaXls, [],
      [], [], [],
      {}
    );
  }

}