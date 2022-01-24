
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthguardService } from './BlockFashion/Tools/serv/authguard.service';


// Dashboard
import { DashboardV1Page }          from './pages/dashboard/v1/dashboard-v1';
import { DashboardV2Page }          from './pages/dashboard/v2/dashboard-v2';
import { DashboardV3Page }          from './pages/dashboard/v3/dashboard-v3';

// Email
import { EmailInboxPage }           from './pages/email/inbox/email-inbox';
import { EmailComposePage }         from './pages/email/compose/email-compose';
import { EmailDetailPage }          from './pages/email/detail/email-detail';

// Widgets
import { WidgetPage }           from './pages/widget/widget';

// Page Options
import { PageBlank }                from './pages/page-options/page-blank/page-blank';
import { PageFooter }               from './pages/page-options/page-with-footer/page-with-footer';
import { PageWithoutSidebar }       from './pages/page-options/page-without-sidebar/page-without-sidebar';
import { PageSidebarRight }         from './pages/page-options/page-with-right-sidebar/page-with-right-sidebar';
import { PageSidebarMinified }      from './pages/page-options/page-with-minified-sidebar/page-with-minified-sidebar';
import { PageTwoSidebar }           from './pages/page-options/page-with-two-sidebar/page-with-two-sidebar';
import { PageFullHeight }   			  from './pages/page-options/page-full-height/page-full-height';
import { PageSidebarWide }          from './pages/page-options/page-with-wide-sidebar/page-with-wide-sidebar';
import { PageSidebarLight }         from './pages/page-options/page-with-light-sidebar/page-with-light-sidebar';
import { PageSidebarTransparent }   from './pages/page-options/page-with-transparent-sidebar/page-with-transparent-sidebar';
import { PageTopMenu }              from './pages/page-options/page-with-top-menu/page-with-top-menu';
import { PageMixedMenu }            from './pages/page-options/page-with-mixed-menu/page-with-mixed-menu';
import { PageMegaMenu }             from './pages/page-options/page-with-mega-menu/page-with-mega-menu';
import { PageBoxedLayout }          from './pages/page-options/page-with-boxed-layout/page-with-boxed-layout';
import { BoxedLayoutMixedMenu }     from './pages/page-options/boxed-layout-with-mixed-menu/boxed-layout-with-mixed-menu';

// UI Element
import { UIGeneralPage }            from './pages/ui-elements/general/general';
import { UITypographyPage }         from './pages/ui-elements/typography/typography';
import { UITabsAccordionsPage }     from './pages/ui-elements/tabs-accordions/tabs-accordions';
import { UIModalNotificationPage }  from './pages/ui-elements/modal-notification/modal-notification';
import { UIWidgetBoxesPage }        from './pages/ui-elements/widget-boxes/widget-boxes';
import { UIMediaObjectPage }        from './pages/ui-elements/media-object/media-object';
import { UIButtonsPage }            from './pages/ui-elements/buttons/buttons';
import { UIIconsPage }              from './pages/ui-elements/icons/icons';
import { UISimpleLineIconsPage }    from './pages/ui-elements/simple-line-icons/simple-line-icons';
import { UIIoniconsPage }           from './pages/ui-elements/ionicons/ionicons';
import { UILanguageIconPage }    		from './pages/ui-elements/language-icon/language-icon';
import { UISocialButtonsPage }      from './pages/ui-elements/social-buttons/social-buttons';

// Bootstrap 4
import { Bootstrap4Page }           from './pages/bootstrap-4/bootstrap-4';

// Chart
import { ChartNgxPage }             from './pages/chart/chart-ngx/chart-ngx';
import { ChartD3Page }             from './pages/chart/chart-d3/chart-d3';

// Calendar
import { CalendarPage }             from './pages/calendar/calendar';

// Map
import { MapPage }            			from './pages/map/map';

// Gallery
import { GalleryV1Page }            from './pages/gallery/gallery-v1/gallery-v1';
import { GalleryV2Page }            from './pages/gallery/gallery-v2/gallery-v2';

// Extra Pages
import { ExtraTimelinePage }        from './pages/extra/extra-timeline/extra-timeline';
import { ExtraComingSoonPage }      from './pages/extra/extra-coming-soon/extra-coming-soon';
import { ExtraSearchResultsPage }   from './pages/extra/extra-search-results/extra-search-results';
import { ExtraInvoicePage }         from './pages/extra/extra-invoice/extra-invoice';
import { ExtraErrorPage }           from './pages/extra/extra-error/extra-error';
import { ExtraProfilePage }         from './pages/extra/extra-profile/extra-profile';

// User Login / Register
import { LoginV1Page }              from './pages/login/login-v1/login-v1';
import { LoginV2Page }              from './pages/login/login-v2/login-v2';
import { LoginV3Page }              from './pages/login/login-v3/login-v3';
import { RegisterV3Page }           from './pages/register/register-v3/register-v3';

// Helper
import { HelperCssPage }            from './pages/helper/helper-css/helper-css';

// Table
import { TableBasicPage }           from './pages/tables/table-basic/table-basic';
import { TableDataPage }           from './pages/tables/table-data/table-data';

// Form
import { FormStuffPage }         from './pages/form-stuff/form-stuff';


import { MainpageComponent } from './BlockFashion/Tools/comp/mainpage/mainpage.component';
import { SalirComponent } from './BlockFashion/Tools/comp/salir/salir.component';
import { LogppalComponent } from './BlockFashion/Tools/comp/logppal/logppal.component';
import { PruebasComponent } from './BlockFashion/Tools/comp/pruebas/pruebas.component';

import { DatosEditarComponent } from './BlockFashion/Admin/comp/datos-editar/datos-editar.component';
import { UsuListaComponent } from './BlockFashion/Admin/comp/usu-lista/usu-lista.component';
import { RolListaComponent } from './BlockFashion/Admin/comp/rol-lista/rol-lista.component';
import { UsuCtaComponent } from './BlockFashion/Admin/comp/usu-cta/usu-cta.component';
import { UsuCrearComponent } from './BlockFashion/Admin/comp/usu-crear/usu-crear.component';
import { UsuEditarComponent } from './BlockFashion/Admin/comp/usu-editar/usu-editar.component';
import { UsuPassComponent } from './BlockFashion/Admin/comp/usu-pass/usu-pass.component';
import { RolCrearComponent } from './BlockFashion/Admin/comp/rol-crear/rol-crear.component';
import { RolCeditarComponent } from './BlockFashion/Admin/comp/rol-ceditar/rol-ceditar.component';
import { MonListaComponent } from './BlockFashion/Admin/comp/mon-lista/mon-lista.component';
import { MonCrearComponent } from './BlockFashion/Admin/comp/mon-crear/mon-crear.component';
import { MonEditarComponent } from './BlockFashion/Admin/comp/mon-editar/mon-editar.component';
import { TcamListaComponent } from './BlockFashion/Admin/comp/tcam-lista/tcam-lista.component';
import { TcamCrearComponent } from './BlockFashion/Admin/comp/tcam-crear/tcam-crear.component';
import { TcamEditarComponent } from './BlockFashion/Admin/comp/tcam-editar/tcam-editar.component';
import { TcamHoyComponent } from './BlockFashion/Admin/comp/tcam-hoy/tcam-hoy.component';
import { CiudListaComponent } from './BlockFashion/Admin/comp/ciud-lista/ciud-lista.component';
import { CiudEditarComponent } from './BlockFashion/Admin/comp/ciud-editar/ciud-editar.component';
import { CiudCrearComponent } from './BlockFashion/Admin/comp/ciud-crear/ciud-crear.component';
import { CargosComponent } from './BlockFashion/Admin/comp/cargos/cargos.component';
import { ViapagoComponent } from './BlockFashion/Admin/comp/viapago/viapago.component';
import { NucleoListaComponent } from './BlockFashion/Afiliados/comp/nucleo-lista/nucleo-lista.component';
import { NucleoEditarComponent } from './BlockFashion/Afiliados/comp/nucleo-editar/nucleo-editar.component';
import { AfilListaComponent } from './BlockFashion/Afiliados/comp/afil-lista/afil-lista.component';
import { AfilEditarComponent } from './BlockFashion/Afiliados/comp/afil-editar/afil-editar.component';
import { LocCrearComponent } from './BlockFashion/Admin/comp/loc-crear/loc-crear.component';
import { SolicitudComponent } from './BlockFashion/Afiliados/comp/solicitud/solicitud.component';
import { TipoactComponent } from './BlockFashion/Organizacion/comp/tipoact/tipoact.component';
import { EventosComponent } from './BlockFashion/Organizacion/comp/eventos/eventos.component';
import { EveEditarComponent } from './BlockFashion/Organizacion/comp/eve-editar/eve-editar.component';
import { EveCrearComponent } from './BlockFashion/Organizacion/comp/eve-crear/eve-crear.component';
import { EveManagerComponent } from './BlockFashion/Organizacion/comp/eve-manager/eve-manager.component';
import { EveUsuarioComponent } from './BlockFashion/Organizacion/comp/eve-usuario/eve-usuario.component';
import { EventosUsuComponent } from './BlockFashion/Organizacion/comp/eventos-usu/eventos-usu.component';
import { CitaPedirComponent } from './BlockFashion/Organizacion/comp/cita-pedir/cita-pedir.component';
import { CitalegalComponent } from './BlockFashion/Organizacion/comp/citalegal/citalegal.component';
import { CitaCrearComponent } from './BlockFashion/Organizacion/comp/cita-crear/cita-crear.component';
import { CitaEditarComponent } from './BlockFashion/Organizacion/comp/cita-editar/cita-editar.component';
import { CitaVerafiComponent } from './BlockFashion/Organizacion/comp/cita-verafi/cita-verafi.component';
import { CitaVernucComponent } from './BlockFashion/Organizacion/comp/cita-vernuc/cita-vernuc.component';
import { CitaVeraboComponent } from './BlockFashion/Organizacion/comp/cita-verabo/cita-verabo.component';
import { QrComponent } from './BlockFashion/Tools/comp/qr/qr.component';
import { RecListaComponent } from './BlockFashion/Finanzas/comp/rec-lista/rec-lista.component';
import { RecAltaComponent } from './BlockFashion/Finanzas/comp/rec-alta/rec-alta.component';
import { RecVerComponent } from './BlockFashion/Finanzas/comp/rec-ver/rec-ver.component';
import { MovbancoComponent } from './BlockFashion/Finanzas/comp/movbanco/movbanco.component';
import { BcoVerComponent } from './BlockFashion/Finanzas/comp/bco-ver/bco-ver.component';
import { BcoPago } from './BlockFashion/Finanzas/models/bcopago';
import { BcopagoListaComponent } from './BlockFashion/Finanzas/comp/bcopago-lista/bcopago-lista.component';
import { BcopagoCrearComponent } from './BlockFashion/Finanzas/comp/bcopago-crear/bcopago-crear.component';
import { BcopagoEditarComponent } from './BlockFashion/Finanzas/comp/bcopago-editar/bcopago-editar.component';
import { BcopagoVerComponent } from './BlockFashion/Finanzas/comp/bcopago-ver/bcopago-ver.component';
import { BrouConcilComponent } from './BlockFashion/Finanzas/comp/brou-concil/brou-concil.component';
import { RedpagoMovComponent } from './BlockFashion/Finanzas/comp/redpago-mov/redpago-mov.component';
import { RedpagoConcilComponent } from './BlockFashion/Finanzas/comp/redpago-concil/redpago-concil.component';
import { GastoListaComponent } from './BlockFashion/Finanzas/comp/gasto-lista/gasto-lista.component';
import { GastoAltaComponent } from './BlockFashion/Finanzas/comp/gasto-alta/gasto-alta.component';
import { GastoVerComponent } from './BlockFashion/Finanzas/comp/gasto-ver/gasto-ver.component';
import { PlanillaComponent } from './BlockFashion/Finanzas/comp/planilla/planilla.component';
import { OtroVerComponent } from './BlockFashion/Finanzas/comp/otro-ver/otro-ver.component';
import { OtroAltaComponent } from './BlockFashion/Finanzas/comp/otro-alta/otro-alta.component';
import { AbogadosComponent } from './BlockFashion/Organizacion/comp/abogados/abogados.component';
import { VermensajesComponent } from './BlockFashion/Tools/comp/vermensajes/vermensajes.component';
import { RecNucleoComponent } from './BlockFashion/Finanzas/comp/rec-nucleo/rec-nucleo.component';
import { NucleopadronComponent } from './BlockFashion/Afiliados/comp/nucleopadron/nucleopadron.component';
import { RecAfiliadoComponent } from './BlockFashion/Finanzas/comp/rec-afiliado/rec-afiliado.component';
import { ProductoComponent } from './BlockFashion/Admin/comp/producto/producto.component';
import { AsigProductoComponent } from './BlockFashion/Afiliados/comp/asig-producto/asig-producto.component';
import { VerProductComponent } from './BlockFashion/Organizacion/comp/ver-product/ver-product.component';
import { PromimoNucleoComponent } from './BlockFashion/Admin/comp/proximo-nucleo/proximo-nucleo.component';
import { CotizantesComponent } from './BlockFashion/Admin/comp/cotizantes/cotizantes.component';
import { ComprobarPadronComponent } from './BlockFashion/Afiliados/comp/comprobar-padron/comprobar-padron.component';
import { ControlPadronComponent } from './BlockFashion/Organizacion/comp/control-padron/control-padron.component';

const routes: Routes = [
  { path: '', redirectTo: '/logppal', pathMatch: 'full' },
  { path: 'logppal', component: LogppalComponent, data: { title: 'Sintep'}},
  { path: 'dashboard/general', component: DashboardV3Page, data: { title: 'Main page'} },
  { path: 'mainpage', component: MainpageComponent, data: { title: 'Main page'} , canActivate: [AuthguardService] },
  { path: 'logout', component: SalirComponent, data: { title: 'Quit'}},
  { path: 'pruebas', component: PruebasComponent, data: { title: 'Pruebas'} },


  // Adiminstrador
  { path: 'datos', component: DatosEditarComponent, data: { title: 'Datos Sintep'}, canActivate: [AuthguardService]  },
  { path: 'users', component: UsuListaComponent, data: { title: 'Usuarios'}, canActivate: [AuthguardService]  },
  { path: 'usunew', component: UsuCrearComponent, data: { title: 'Crear Usuario'}, canActivate: [AuthguardService]  },
  { path: 'usuedi/:name', component: UsuEditarComponent, data: { title: 'Edicion de usuario'}, canActivate: [AuthguardService]  },
  { path: 'account', component: UsuCtaComponent, data: { title: 'Cuenta del usuario'}, canActivate: [AuthguardService]  },
  { path: 'usupass', component: UsuPassComponent, data: { title: 'Cambiar password'}, canActivate: [AuthguardService]  },
  { path: 'roles', component: RolListaComponent, data: { title: 'Roles de usuarios'}, canActivate: [AuthguardService]  },
  { path: 'rolnew', component: RolCrearComponent, data: { title: 'Crear Rol'}, canActivate: [AuthguardService]  },
  { path: 'roledi/:id', component: RolCeditarComponent, data: { title: 'Editar roles'}, canActivate: [AuthguardService]  },
  { path: 'monedas', component: MonListaComponent, data: { title: 'Monedas'}, canActivate: [AuthguardService]  },
  { path: 'monnew', component: MonCrearComponent, data: { title: 'Crear Moneda'}, canActivate: [AuthguardService]  },
  { path: 'monedi/:id', component: MonEditarComponent, data: { title: 'Editar Moneda'}, canActivate: [AuthguardService]  },
  { path: 'tcam-lista/:idMon', component: TcamListaComponent, data: { title: 'Monedas'}, canActivate: [AuthguardService] },
  { path: 'tcam-crear/:idMon', component: TcamCrearComponent, data: { title: 'Crear moneda'}, canActivate: [AuthguardService] },
  { path: 'tcam-editar/:idTC', component: TcamEditarComponent, data: { title: 'Editar moneda'}, canActivate: [AuthguardService] },
  { path: 'tcam-hoy', component: TcamHoyComponent, data: { title: 'Tipo de Cambio'}, canActivate: [AuthguardService] },
  { path: 'ciudades', component: CiudListaComponent, data: { title: 'Ciudades'}, canActivate: [AuthguardService] },
  { path: 'proximo-nucleo', component: PromimoNucleoComponent, data: { title: 'Ciudades'}, canActivate: [AuthguardService] },
  { path: 'ciudnew/:idDep', component: CiudCrearComponent, data: { title: 'Crear ciudad'}, canActivate: [AuthguardService] },
  { path: 'ciudedi/:idCiud', component: CiudEditarComponent, data: { title: 'Editar ciudad'}, canActivate: [AuthguardService] },
  { path: 'producto', component: ProductoComponent, data: { title: 'Producto'}, canActivate: [AuthguardService] },
  //{ path: 'locnew', component: LocCrearComponent, data: { title: 'Crear localidad'}, canActivate: [AuthguardService] },
  { path: 'cargos', component: CargosComponent, data: { title: 'Cargos Profesionales'}, canActivate: [AuthguardService] },
  { path: 'vias', component: ViapagoComponent, data: { title: 'Vías de pago'}, canActivate: [AuthguardService] },
  { path: 'chequeos', component: VermensajesComponent, data: { title: 'Control de integridad'}, canActivate: [AuthguardService] },

  // Afiliados
  { path: 'nucleos', component: NucleoListaComponent, data: { title: 'Núcleos'}, canActivate: [AuthguardService] },
  { path: 'nucleo-editar/:id', component: NucleoEditarComponent, data: { title: 'Datos del núcleo'}, canActivate: [AuthguardService] },
  { path: 'nucleo-padron', component: NucleopadronComponent, data: { title: 'Padrón de núcleos'}, canActivate: [AuthguardService] },
  { path: 'afiliados', component: AfilListaComponent, data: { title: 'Afiliad@s'}, canActivate: [AuthguardService] },
  { path: 'afil-editar/:id', component: AfilEditarComponent, data: { title: 'Datos de afiliada/o'}, canActivate: [AuthguardService] },
  { path: 'solicitud/:id', component: SolicitudComponent, data: { title: 'Solicitud de ingreso'}},
  { path: 'asig-producto', component: AsigProductoComponent, data: { title: 'Solicitud de ingreso'}},

  // Organizacion
  { path: 'abogados', component: AbogadosComponent, data: { title: 'Lista de Abogados'}, canActivate: [AuthguardService] },
  { path: 'tipoact', component: TipoactComponent, data: { title: 'Tipos de Actividades'}, canActivate: [AuthguardService] },
  { path: 'eventos', component: EventosComponent, data: { title: 'Eventos'}, canActivate: [AuthguardService]  },
  { path: 'evenew', component: EveCrearComponent, data: { title: 'Crear Evento'}, canActivate: [AuthguardService]  },
  { path: 'eveedi/:id', component: EveEditarComponent, data: { title: 'Editar Evento'}, canActivate: [AuthguardService]  },
  { path: 'evemanager/:id', component: EveManagerComponent, data: { title: 'Manager de Evento'}, canActivate: [AuthguardService]  },
  { path: 'eventos-usu', component: EventosUsuComponent, data: { title: 'Eventos de un usuario'}, canActivate: [AuthguardService]  },
  { path: 'citas', component: CitalegalComponent, data: { title: 'Calendario de citas'}, canActivate: [AuthguardService]  },
  { path: 'citanew', component: CitaCrearComponent, data: { title: 'Crear cita legal'}, canActivate: [AuthguardService]  },
  { path: 'cita-editar/:id/:modo', component: CitaEditarComponent, data: { title: 'Editar o ver cita legal'},
  canActivate: [AuthguardService]  },
  { path: 'cita-verafi', component: CitaVerafiComponent, data: { title: 'Consultas de un afiliado'}, canActivate: [AuthguardService]  },
  { path: 'cita-vernuc', component: CitaVernucComponent, data: { title: 'Consultas de un núcleo'}, canActivate: [AuthguardService]  },
  { path: 'cita-verabo', component: CitaVeraboComponent, data: { title: 'Consultas de un abogado'}, canActivate: [AuthguardService]  },
  { path: 'ver-product', component: VerProductComponent, data: { title: 'Ver productos solicitados'}, canActivate: [AuthguardService]  },

  //Finanzas
  { path: 'recibos', component: RecListaComponent, data: { title: 'Recibos'}, canActivate: [AuthguardService] },
  { path: 'rec-nucleo', component: RecNucleoComponent, data: { title: 'Recibos'}, canActivate: [AuthguardService] },
  { path: 'recalta', component: RecAltaComponent, data: { title: 'Alta de Recibos'}, canActivate: [AuthguardService] },
  { path: 'recver/:id', component: RecVerComponent, data: { title: 'Visualizar Recibo'}, canActivate: [AuthguardService] },
  { path: 'movbanco', component: MovbancoComponent , data: { title: 'Movimientos Bancarios'}, canActivate: [AuthguardService] },
  { path: 'bcover/:id', component: BcoVerComponent , data: { title: 'Ver Movimiento Bancario'}, canActivate: [AuthguardService] },
  { path: 'bcopagos', component: BcopagoListaComponent, data: { title: 'Pagos bancarios'}, canActivate: [AuthguardService] },
  { path: 'pagoalta/:idNuc/:idAfi', component: BcopagoCrearComponent, data: { title: 'Alta de un pago'}, canActivate: [AuthguardService] },
  { path: 'pagoedit/:id', component: BcopagoEditarComponent, data: { title: 'Editar un pago'}, canActivate: [AuthguardService] },
  { path: 'pagover/:id', component: BcopagoVerComponent, data: { title: 'Ver un pago'}, canActivate: [AuthguardService] },
  { path: 'brouconcil', component: BrouConcilComponent, data: { title: 'Conciliación BROU'}, canActivate: [AuthguardService] },
  { path: 'redpagomov', component: RedpagoMovComponent, data: { title: 'Movimientos REDPAGO'}, canActivate: [AuthguardService] },
  { path: 'redpagoconcil', component: RedpagoConcilComponent, data: { title: 'Conciliación REDPAGO'}, canActivate: [AuthguardService] },
  { path: 'gastos', component: GastoListaComponent, data: { title: 'Gastos'}, canActivate: [AuthguardService] },
  { path: 'gastoalta', component: GastoAltaComponent, data: { title: 'Alta de Gastos'}, canActivate: [AuthguardService] },
  { path: 'gastover/:id', component: GastoVerComponent, data: { title: 'Visualizar Gasto'}, canActivate: [AuthguardService] },
  { path: 'planilla', component: PlanillaComponent, data: { title: 'Planilla contable'}, canActivate: [AuthguardService] },
  { path: 'otroalta', component: OtroAltaComponent, data: { title: 'Movimientos de Ajuste'}, canActivate: [AuthguardService] },
  { path: 'otrover/:id', component: OtroVerComponent, data: { title: 'Visualizar Ajuste'}, canActivate: [AuthguardService] },
  { path: 'rec-afiliado', component: RecAfiliadoComponent, data: { title: 'Recibos Individuales'}, canActivate: [AuthguardService] },

  //En la web del afiliado (App)
  { path: 'eve-usuario', component: EveUsuarioComponent, data: { title: 'Mis Eventos'}, canActivate: [AuthguardService]  },
  { path: 'pedir-cita', component: CitaPedirComponent, data: { title: 'Solicitar cita legal'}, canActivate: [AuthguardService]  },
  { path: 'qrafiliado', component: QrComponent, data: { title: 'Desplegar el QR'}, canActivate: [AuthguardService]  },





  { path: 'dashboard/v1', component: DashboardV1Page, data: { title: 'Dashboard V1'} },
  { path: 'dashboard/v2', component: DashboardV2Page, data: { title: 'Dashboard V2'} },
  { path: 'dashboard/v3', component: DashboardV3Page, data: { title: 'Dashboard V3'} },
  { path: 'email/inbox', component: EmailInboxPage, data: { title: 'Email Inbox'} },
  { path: 'email/compose', component: EmailComposePage, data: { title: 'Email Compose'} },
  { path: 'email/detail', component: EmailDetailPage, data: { title: 'Email Detail'} },
  { path: 'widget', component: WidgetPage, data: { title: 'Widgets'} },
  { path: 'page-option/page-blank', component: PageBlank, data: { title: 'Blank Page'} },
  { path: 'page-option/page-with-footer', component: PageFooter, data: { title: 'Page with Footer' } },
  { path: 'page-option/page-without-sidebar', component: PageWithoutSidebar, data: { title: 'Page without Sidebar' } },
  { path: 'page-option/page-with-right-sidebar', component: PageSidebarRight, data: { title: 'Page with Right Sidebar' } },
  { path: 'page-option/page-with-minified-sidebar', component: PageSidebarMinified, data: { title: 'Page with Minified Sidebar'} },
  { path: 'page-option/page-with-two-sidebar', component: PageTwoSidebar, data: { title: 'Page with Two Sidebar' } },
  { path: 'page-option/page-full-height', component: PageFullHeight, data: { title: 'Full Height Content' } },
  { path: 'page-option/page-with-wide-sidebar', component: PageSidebarWide, data: { title: 'Page with Wide Sidebar' } },
  { path: 'page-option/page-with-light-sidebar', component: PageSidebarLight, data: { title: 'Page with Light Sidebar' } },
  { path: 'page-option/page-with-transparent-sidebar', component: PageSidebarTransparent, data: { title: 'Page with Transparent Sidebar' } },
  { path: 'page-option/page-with-top-menu', component: PageTopMenu, data: { title: 'Page with Top Menu' } },
  { path: 'page-option/page-with-mixed-menu', component: PageMixedMenu, data: { title: 'Page with Mixed Menu' } },
  { path: 'page-option/page-with-boxed-layout', component: PageBoxedLayout, data: { title: 'Page with Boxed Layout' } },
  { path: 'page-option/page-with-mega-menu', component: PageMegaMenu, data: { title: 'Page with Mega Menu' } },
  { path: 'page-option/boxed-layout-with-mixed-menu', component: BoxedLayoutMixedMenu, data: { title: 'Boxed Layout with Mixed Menu' } },


  { path: 'ui/general', component: UIGeneralPage, data: { title: 'UI General'} },
  { path: 'ui/typography', component: UITypographyPage, data: { title: 'UI Typography'} },
  { path: 'ui/tabs-accordions', component: UITabsAccordionsPage, data: { title: 'UI Tabs & Accordions'} },
  { path: 'ui/modal-notification', component: UIModalNotificationPage, data: { title: 'UI Modal & Notification'} },
  { path: 'ui/widget-boxes', component: UIWidgetBoxesPage, data: { title: 'UI Widget Boxes'} },
  { path: 'ui/media-object', component: UIMediaObjectPage, data: { title: 'UI Media Object'} },
  { path: 'ui/buttons', component: UIButtonsPage, data: { title: 'UI Buttons'} },
  { path: 'ui/icons', component: UIIconsPage, data: { title: 'UI Icons'} },
  { path: 'ui/simple-line-icons', component: UISimpleLineIconsPage, data: { title: 'UI SimpleLineIcons'} },
  { path: 'ui/ionicons', component: UIIoniconsPage, data: { title: 'UI Ionicons'} },
  { path: 'ui/language-icon', component: UILanguageIconPage, data: { title: 'UI Language Bar Icon'} },
  { path: 'ui/social-buttons', component: UISocialButtonsPage, data: { title: 'UI Social Buttons'} },

  { path: 'bootstrap-4', component: Bootstrap4Page, data: { title: 'Bootstrap 4'} },

  { path: 'chart/ngx', component: ChartNgxPage, data: { title: 'Chart Ngx'} },
  { path: 'chart/d3', component: ChartD3Page, data: { title: 'Chart D3'} },

  { path: 'calendar', component: CalendarPage, data: { title: 'Calendar'} },

  { path: 'map', component: MapPage, data: { title: 'Google Map'} },

  { path: 'gallery/v1', component: GalleryV1Page, data: { title: 'Gallery V1'} },
  { path: 'gallery/v2', component: GalleryV2Page, data: { title: 'Gallery V2'} },

  { path: 'extra/timeline', component: ExtraTimelinePage, data: { title: 'Timeline'} },
  { path: 'extra/coming-soon', component: ExtraComingSoonPage, data: { title: 'Coming Soon Page'} },
  { path: 'extra/search-results', component: ExtraSearchResultsPage, data: { title: 'Search Results Page'} },
  { path: 'extra/error-page', component: ExtraErrorPage, data: { title: 'Error Page'} },
  { path: 'extra/invoice', component: ExtraInvoicePage, data: { title: 'Invoice'} },
  { path: 'extra/profile', component: ExtraProfilePage, data: { title: 'Profile Page'} },

  { path: 'login/v1', component: LoginV1Page, data: { title: 'Login V1 Page'} },
  { path: 'login/v2', component: LoginV2Page, data: { title: 'Login V2 Page'} },
  { path: 'login/v3', component: LoginV3Page, data: { title: 'Login V3 Page'} },
  { path: 'register/v3', component: RegisterV3Page, data: { title: 'Register V3 Page'} },

  { path: 'helper/css', component: HelperCssPage, data: { title: 'Helper CSS'} },

  { path: 'table/basic', component: TableBasicPage, data: { title: 'Basic Tables'} },
  { path: 'table/data', component: TableDataPage, data: { title: 'Ngx DataTable'} },

  { path: 'form-stuff', component: FormStuffPage, data: { title: 'Form Stuff'} },

  { path: 'cotizantes', component: CotizantesComponent, data: { title: 'Cotizantes'}, canActivate: [AuthguardService] },
  { path: 'comprobar-padron/:origin', component: ComprobarPadronComponent, data: { title: 'Cotizantes'}, canActivate: [AuthguardService] },
  { path: 'control-padron', component: ControlPadronComponent, data: { title: 'Cotizantes'}, canActivate: [AuthguardService] },


];

@NgModule({
  imports: [ CommonModule, RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
