import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { PedidoHeader } from '../../models/pedido-header';
import { SeparationHeader } from '../../models/separation-header';
import { VisoresService } from '../../services/visores.service';
import { ZoomPedidoComponent } from '../zoom-pedido/zoom-pedido.component';
import { ZoomSeparacionComponent } from '../zoom-separacion/zoom-separacion.component';

interface Estado {
  id: string;
  dsc: string;
}

@Component({
  selector: 'app-visor-pedidos',
  templateUrl: './visor-pedidos.component.html',
  styleUrls: ['./visor-pedidos.component.scss']
})
export class VisorPedidosComponent implements OnInit {

  lista: PedidoHeader[] = [];
  feci:any;
  fecf:any;
  estado = 'S';
  estados: Estado[] = [];
  selectedState: Estado = {id: 'S', dsc: 'En separación'};

  constructor(private viser: VisoresService, public dialogService: DialogService) { }

  ngOnInit() {
    this.cargoEstados();
    this.feci = formatDate(new Date(), 'YYYY-MM-dd',"en-US");
    this.fecf = formatDate(new Date(), 'YYYY-MM-dd',"en-US");
    this.cargoData();
  }

  cargoData() {
    this.lista = [];
    console.log(this.selectedState);
    console.log(this.selectedState.id + '//' + this.feci + '//' + this.fecf);
    this.viser.findActiveOrders(this.selectedState.id, this.feci, this.fecf).subscribe(
      resu => {
        console.log(resu);
        if (resu.length !=0) {
          this.lista = resu;
          
        }else{ Swal.fire("","No se encontraron datos para este rango","info")}
      }, error => {
        console.log(error);
      }
    );
  }

  cargoEstados() {
    this.estados.push({id: 'S', dsc: 'En separación'});
    this.estados.push({id: 'P', dsc: 'Pendientes'});
    this.estados.push({id: '*', dsc: 'Todas'});
  }

  zoomPedido(pedi: PedidoHeader) {
    console.log(pedi);
    const ref = this.dialogService.open(ZoomPedidoComponent, {
      data: {
          pedido: pedi
      },
      header: 'Zooming del pedido',
      width: '80%',
      baseZIndex: 10000
    });
  }

  zoomSeparacion(sepa: number) {
    console.log(sepa);
    const sepah = new SeparationHeader();
    sepah.separationId = sepa;
    const ref = this.dialogService.open(ZoomSeparacionComponent, {
      data: {
          separacion: sepah
      },
      header: 'Zooming de separación',
      width: '80%',
      baseZIndex: 10000
    });

  }

}
