import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { Pedido } from '../../models/pedido';
import { PedidoHeader } from '../../models/pedido-header';
import { VisoresService } from '../../services/visores.service';

@Component({
  selector: 'app-zoom-pedido',
  templateUrl: './zoom-pedido.component.html',
  styleUrls: ['./zoom-pedido.component.scss']
})
export class ZoomPedidoComponent implements OnInit {

  pedheader: PedidoHeader = new PedidoHeader;
  pedido: Pedido = new Pedido;
  fecha: string = "";
  estado: string = "";

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private viser: VisoresService) { }

  ngOnInit() {
    this.pedheader = this.config.data.pedido;
    console.log(this.pedheader);
    this.viser.findOrderbyId(this.pedheader.orderId).subscribe(
      resu => {
        console.log(resu);
        this.pedido = resu;
        this.estado = 'S/D';
        if (this.pedido.inSeparation) {
          this.estado = 'En separación';
        } else {
          this.estado = 'Pendiente';
        }
        this.fecha = formatDate(this.pedido.date, 'DD/MM/YYYY',"en-US");
      }, () => {
        Swal.fire("Error", "No se puede leer el articulo","error");
        this.ref.close();
      }
    );
  }

}
