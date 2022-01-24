import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { VisorPedidosComponent } from './components/visor-pedidos/visor-pedidos.component';
import { ZoomSeparacionComponent } from './components/zoom-separacion/zoom-separacion.component';
import { VisorSeparacionesComponent } from './components/visor-separaciones/visor-separaciones.component';
import { ZoomPedidoComponent } from './components/zoom-pedido/zoom-pedido.component';
import { DialogService, DropdownModule, MultiSelectModule } from 'primeng-lts';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Select2Module } from 'ng-select2-component';
import { FormModule } from 'src/app/pages/form/form.module';
import { IconsModule } from 'src/app/pages/icons/icons.module';
import { TablesModule } from 'src/app/pages/tables/tables.module';
import { PrimengModule } from '../commons/primeng/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackPedidoComponent } from './components/track-pedido/track-pedido.component';
import { ListSesionesComponent } from './components/sesiones-envio/list-sesiones/list-sesiones.component';
import { DetalleEnvioComponent } from './components/sesiones-envio/detalle-envio/detalle-envio.component';
import { PaquetesEnvioComponent } from './components/sesiones-envio/paquetes-envio/paquetes-envio.component';
import { SdsEnvioComponent } from './components/sesiones-envio/sds-envio/sds-envio.component';
import { DevicesComponent } from './components/devices/devices.component';
import { DeviceDateComponent } from './components/device-date/device-date.component';
import { StorageListComponent } from './components/storage-list/storage-list.component';
import { StorageDataComponent } from './components/storage-data/storage-data.component';
import { TipoCargaComponent } from './components/tipo-carga/tipo-carga.component';
import { TipoCargaDataComponent } from './components/tipo-carga-data/tipo-carga-data.component';
import { TipoEstanteriaComponent } from './components/tipo-estanteria/tipo-estanteria.component';
import { TipoEstanteriaDataComponent } from './components/tipo-estanteria-data/tipo-estanteria-data.component';
import { PuntosPickingComponent } from './components/puntos-picking/puntos-picking.component';
import { PuntosPickingDataComponent } from './components/puntos-picking-data/puntos-picking-data.component';
import { PlanosComponent } from './components/planos/planos.component';
import { AsignPointComponent } from './components/asign-point/asign-point.component';
import { AsignoLocacionesComponent } from './components/asigno-locaciones/asigno-locaciones.component';
import { CreoPlanoComponent } from './components/creo-plano/creo-plano.component';


@NgModule({
  declarations: [
    VisorPedidosComponent,
    VisorSeparacionesComponent,
    ZoomSeparacionComponent,
    ZoomPedidoComponent,
    TrackPedidoComponent,
    ListSesionesComponent,
    DetalleEnvioComponent,
    PaquetesEnvioComponent,
    SdsEnvioComponent,
    DevicesComponent,
    DeviceDateComponent,
    StorageListComponent,
    StorageDataComponent,
    TipoCargaComponent,
    TipoCargaDataComponent,
    TipoEstanteriaComponent,
    TipoEstanteriaDataComponent,
    PuntosPickingComponent,
    PuntosPickingDataComponent,
    PlanosComponent,
    AsignPointComponent,
    AsignoLocacionesComponent,
    CreoPlanoComponent
    
  ],
  providers:[DialogService],

  imports: [
    CommonModule,
    GeneralRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormModule,
    TablesModule,
    IconsModule,
    PrimengModule,
    DataTablesModule,
    NgbDropdownModule,
    MultiSelectModule,
    DropdownModule,
    Select2Module
  ]
})
export class GeneralModule { }
