import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from 'primeng/dynamicdialog';
import { ZoomSeparacionComponent } from '../zoom-separacion/zoom-separacion.component';
import { OrderAndSepa } from '../../models/order-and-sepa';
import { VisoresService } from '../../services/visores.service';
import { PedidoItem } from '../../models/pedido-item';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-track-pedido',
  templateUrl: './track-pedido.component.html',
  styleUrls: ['./track-pedido.component.scss']
})
export class TrackPedidoComponent implements OnInit {

  pedidoId = '';
  pedido: OrderAndSepa | null = null;
  fecha: string = "";
  estado = 'S/D';
  destino = '';
  items: PedidoItem[] = [];

  constructor(private viser: VisoresService, public dialogService: DialogService) { }

  ngOnInit() {
  }

  buscoPedido() {
    this.viser.trackOrderByERPId(this.pedidoId).subscribe(
      resu => {
        console.log(resu);
        this.pedido = resu;
        this.fecha = formatDate(this.pedido.pendingOrder.date, 'dd/MM/YYYY',"en-US");
        if (this.pedido.pendingOrder.inSeparation) {
          this.estado = 'En separación';
        } else {
          this.estado = 'Pendiente';
        }
        if (this.pedido.pendingOrder.targetStorageDsc) {
          this.destino = this.pedido.pendingOrder.targetStorageDsc;
        }
        if (this.pedido.pendingOrder.orderItemsList) {
          this.items = this.pedido.pendingOrder.orderItemsList;
          console.log("Los pedidos son");
          console.log(this.items);
        }
      }, error => {
        Swal.fire("Error","No se pudo leer el envio","error");
      }
    );
  }

  zoomSeparacion() {
    const ref = this.dialogService.open(ZoomSeparacionComponent, {
      data: {
          separacion: this.pedido ? this.pedido.separationHeader : ""
      },
      header: 'Zooming de separación',
      width: '80%',
      baseZIndex: 10000
    });

  }
}
