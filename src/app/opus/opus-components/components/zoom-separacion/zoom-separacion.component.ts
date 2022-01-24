import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import Swal from 'sweetalert2';
import { OrderHeader } from '../../models/order-header';
import { PedidoHeader } from '../../models/pedido-header';
import { SeparationHeader } from '../../models/separation-header';
import { SeparationOrder } from '../../models/separation-order';
import { VisoresService } from '../../services/visores.service';
import { ZoomPedidoComponent } from '../zoom-pedido/zoom-pedido.component';

@Component({
  selector: 'app-zoom-separacion',
  templateUrl: './zoom-separacion.component.html',
  styleUrls: ['./zoom-separacion.component.scss']
})
export class ZoomSeparacionComponent implements OnInit {

  sepaheader: SeparationHeader = new SeparationHeader ;
  separacion: SeparationOrder = new SeparationOrder;
  fecha: string="";
  estado: string="";

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private viser: VisoresService, public dialogService: DialogService) { }

  ngOnInit() {
    this.sepaheader = this.config.data.separacion;
    console.log(this.sepaheader);
    this.viser.findFullSeparationById(this.sepaheader.separationId).subscribe(
      resu => {
        console.log(resu);
        this.separacion = resu;
        this.estado = 'S/D';
        switch (this.separacion.separationState) {
          case 'S':
            this.estado = 'En separación';
            break;

          case 'T':
            this.estado = 'Terminada';
            break;

          case 'L':
            this.estado = 'Sin usuario';
            break;
        }
        this.fecha = formatDate(this.separacion.separationStartDate, 'DD/MM/YYYY',"en-US");
      }, () => {
        Swal.fire("Error","Error al intentar leer la separacion","error");
        this.ref.close();
      }
    );
  }

  zoomPedido(pedi: OrderHeader) {
    console.log(pedi);
    let elpe = new PedidoHeader();
    elpe.orderId = pedi.orderId;
    const ref = this.dialogService.open(ZoomPedidoComponent, {
      data: {
          pedido: elpe
      },
      header: 'Zooming del pedido',
      width: '80%',
      baseZIndex: 10000
    });
  }
}
