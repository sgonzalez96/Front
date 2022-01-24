import { ListSesionesComponent } from './components/sesiones-envio/list-sesiones/list-sesiones.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from '../commons/authguard.service';
import { TrackPedidoComponent } from './components/track-pedido/track-pedido.component';
import { VisorPedidosComponent } from './components/visor-pedidos/visor-pedidos.component';
import { VisorSeparacionesComponent } from './components/visor-separaciones/visor-separaciones.component';
import { HomeComponent } from './components/home/home.component';
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


const routes: Routes = [
  { path: 'pedidos', component: VisorPedidosComponent, canActivate: [AuthguardService]  },
  { path: 'separaciones', component: VisorSeparacionesComponent, canActivate: [AuthguardService]  },
  { path: 'trackpedidos', component: TrackPedidoComponent, canActivate: [AuthguardService]  },
  { path: 'sesionesenvio', component: ListSesionesComponent, canActivate: [AuthguardService]  },
  { path: 'pag-principal', component: HomeComponent, canActivate: [AuthguardService]  },

  { path: 'devices', component: DevicesComponent, canActivate: [AuthguardService]  },
  { path: 'device-data/:id/:mode', component: DeviceDateComponent, canActivate: [AuthguardService]  },
  { path: 'storages', component: StorageListComponent, canActivate: [AuthguardService]  },
  { path: 'storage-data/:id/:mode', component: StorageDataComponent, canActivate: [AuthguardService]  },
  { path: 'tipos-carga', component: TipoCargaComponent, canActivate: [AuthguardService]  },
  { path: 'tipos-carga-data/:id/:mode', component: TipoCargaDataComponent, canActivate: [AuthguardService]  },
  { path: 'tipos-estanterias', component: TipoEstanteriaComponent, canActivate: [AuthguardService]  },
  { path: 'tipos-estanteria-data/:id/:mode', component: TipoEstanteriaDataComponent, canActivate: [AuthguardService]  },
  { path: 'puntos-picking', component: PuntosPickingComponent, canActivate: [AuthguardService]  },
  { path: 'puntos-picking-data/:id/:mode', component: PuntosPickingDataComponent, canActivate: [AuthguardService]  },
  { path: 'planos', component: PlanosComponent, canActivate: [AuthguardService]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
