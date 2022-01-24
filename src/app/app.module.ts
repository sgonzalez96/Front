// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule }               from '@angular/platform-browser/animations';
import { BrowserModule, Title }                  from '@angular/platform-browser';
import { AppRoutingModule }                      from './app-routing.module';
import { NgbModule }                             from '@ng-bootstrap/ng-bootstrap';
import { NgModule }                              from '@angular/core';
import { FormsModule, ReactiveFormsModule }      from '@angular/forms';
import { MatSortModule, MatTableModule }         from '@angular/material';
import * as global                               from './config/globals';


// Main Component
import { AppComponent }                    from './app.component';
import { HeaderComponent }                 from './components/header/header.component';
import { SidebarComponent }                from './components/sidebar/sidebar.component';
import { SidebarRightComponent }           from './components/sidebar-right/sidebar-right.component';
import { TopMenuComponent }                from './components/top-menu/top-menu.component';
import { FooterComponent }                 from './components/footer/footer.component';
import { PanelComponent }                  from './components/panel/panel.component';
import { FloatSubMenuComponent }           from './components/float-sub-menu/float-sub-menu.component';


// Component Module
import { AgmCoreModule }                   from '@agm/core';
import { FullCalendarModule }              from '@fullcalendar/angular';
import { LoadingBarRouterModule }          from '@ngx-loading-bar/router';
import { NgxChartsModule }                 from '@swimlane/ngx-charts';
import { NgxDatatableModule }              from '@swimlane/ngx-datatable';
import { TrendModule }                     from 'ngx-trend';
import { HighlightJsModule }               from 'ngx-highlight-js';
import { CountdownModule }                 from 'ngx-countdown';
import { ChartsModule }                    from 'ng4-charts/ng4-charts';
import { TagInputModule }                  from 'ngx-chips';
import { SweetAlert2Module }               from '@sweetalert2/ngx-sweetalert2';
import { Ng2TableModule }                  from 'ngx-datatable/ng2-table';
import { NvD3Module }                      from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { CalendarModule, DateAdapter }     from 'angular-calendar';
import { adapterFactory }                  from 'angular-calendar/date-adapters/date-fns';
import { PerfectScrollbarModule }          from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG }        from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// Pages
import { DashboardV1Page }          from './pages/dashboard/v1/dashboard-v1';
import { DashboardV2Page }          from './pages/dashboard/v2/dashboard-v2';
import { DashboardV3Page }          from './pages/dashboard/v3/dashboard-v3';
import { EmailInboxPage }           from './pages/email/inbox/email-inbox';
import { EmailComposePage }         from './pages/email/compose/email-compose';
import { EmailDetailPage }          from './pages/email/detail/email-detail';

// Widgets
import { WidgetPage }               from './pages/widget/widget';

// Page Options
import { PageBlank }                from './pages/page-options/page-blank/page-blank';
import { PageFooter }               from './pages/page-options/page-with-footer/page-with-footer';
import { PageWithoutSidebar }       from './pages/page-options/page-without-sidebar/page-without-sidebar';
import { PageSidebarRight }         from './pages/page-options/page-with-right-sidebar/page-with-right-sidebar';
import { PageSidebarMinified }      from './pages/page-options/page-with-minified-sidebar/page-with-minified-sidebar';
import { PageFullHeight }           from './pages/page-options/page-full-height/page-full-height';
import { PageTwoSidebar }           from './pages/page-options/page-with-two-sidebar/page-with-two-sidebar';
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
import { UILanguageIconPage }       from './pages/ui-elements/language-icon/language-icon';
import { UISocialButtonsPage }      from './pages/ui-elements/social-buttons/social-buttons';
import { AngularMyDatePickerModule} from 'angular-mydatepicker';

// Bootstrap 4
import { Bootstrap4Page }           from './pages/bootstrap-4/bootstrap-4';

// Calendar
import { CalendarPage }             from './pages/calendar/calendar';

// Map
import { MapPage }                  from './pages/map/map';

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

// Chart
import { ChartNgxPage }             from './pages/chart/chart-ngx/chart-ngx';
import { ChartD3Page }              from './pages/chart/chart-d3/chart-d3';

// Table
import { TableBasicPage }           from './pages/tables/table-basic/table-basic';
import { TableDataPage }            from './pages/tables/table-data/table-data';

import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TableModule} from 'primeng/table';

// Form
import { FormStuffPage }            from './pages/form-stuff/form-stuff';
import { LogppalComponent } from './BlockFashion/Tools/comp/logppal/logppal.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DatosEditarComponent } from './BlockFashion/Admin/comp/datos-editar/datos-editar.component';
import { InvswalComponent } from './BlockFashion/Tools/comp/invswal/invswal.component';
import { UsuListaComponent } from './BlockFashion/Admin/comp/usu-lista/usu-lista.component';
import { UsuCrearComponent } from './BlockFashion/Admin/comp/usu-crear/usu-crear.component';
import { UsuEditarComponent } from './BlockFashion/Admin/comp/usu-editar/usu-editar.component';
import { UsuPassComponent } from './BlockFashion/Admin/comp/usu-pass/usu-pass.component';
import { UsuCtaComponent } from './BlockFashion/Admin/comp/usu-cta/usu-cta.component';
import { RolListaComponent } from './BlockFashion/Admin/comp/rol-lista/rol-lista.component';
import { RolCrearComponent } from './BlockFashion/Admin/comp/rol-crear/rol-crear.component';
import { RolCeditarComponent } from './BlockFashion/Admin/comp/rol-ceditar/rol-ceditar.component';
import { MonListaComponent } from './BlockFashion/Admin/comp/mon-lista/mon-lista.component';
import { MonEditarComponent } from './BlockFashion/Admin/comp/mon-editar/mon-editar.component';
import { MonCrearComponent } from './BlockFashion/Admin/comp/mon-crear/mon-crear.component';
import { MainpageComponent } from './BlockFashion/Tools/comp/mainpage/mainpage.component';
import { SalirComponent } from './BlockFashion/Tools/comp/salir/salir.component';
import { TcamListaComponent } from './BlockFashion/Admin/comp/tcam-lista/tcam-lista.component';
import { TcamCrearComponent } from './BlockFashion/Admin/comp/tcam-crear/tcam-crear.component';
import { TcamEditarComponent } from './BlockFashion/Admin/comp/tcam-editar/tcam-editar.component';
import { TcamHoyComponent } from './BlockFashion/Admin/comp/tcam-hoy/tcam-hoy.component';
import { EnvServiceProvider } from './BlockFashion/Tools/serv/env.service.provider';
import { CiudListaComponent } from './BlockFashion/Admin/comp/ciud-lista/ciud-lista.component';
import { CiudEditarComponent } from './BlockFashion/Admin/comp/ciud-editar/ciud-editar.component';
import { CiudCrearComponent } from './BlockFashion/Admin/comp/ciud-crear/ciud-crear.component';
import { CargosComponent } from './BlockFashion/Admin/comp/cargos/cargos.component';
import { ViapagoComponent } from './BlockFashion/Admin/comp/viapago/viapago.component';
import { NucleoListaComponent } from './BlockFashion/Afiliados/comp/nucleo-lista/nucleo-lista.component';
import { NucleoEditarComponent } from './BlockFashion/Afiliados/comp/nucleo-editar/nucleo-editar.component';
import { PruebasComponent } from './BlockFashion/Tools/comp/pruebas/pruebas.component';
import { AfilListaComponent } from './BlockFashion/Afiliados/comp/afil-lista/afil-lista.component';
import { AfilEditarComponent } from './BlockFashion/Afiliados/comp/afil-editar/afil-editar.component';
import { LocCrearComponent } from './BlockFashion/Admin/comp/loc-crear/loc-crear.component';
import { SolicitudComponent } from './BlockFashion/Afiliados/comp/solicitud/solicitud.component';
import { TipoactComponent } from './BlockFashion/Organizacion/comp/tipoact/tipoact.component';
import { EventosComponent } from './BlockFashion/Organizacion/comp/eventos/eventos.component';
import { EveCrearComponent } from './BlockFashion/Organizacion/comp/eve-crear/eve-crear.component';
import { EveEditarComponent } from './BlockFashion/Organizacion/comp/eve-editar/eve-editar.component';
import { DigitsDirective } from './BlockFashion/Tools/directives/digits.directive';
import { OnlydigitsDirective } from './BlockFashion/Tools/directives/onlydigits.directive';
import { EveManagerComponent } from './BlockFashion/Organizacion/comp/eve-manager/eve-manager.component';
import { AfilVerComponent } from './BlockFashion/Afiliados/comp/afil-ver/afil-ver.component';
import { CostosComponent } from './BlockFashion/Admin/comp/costos/costos.component';
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
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { RecListaComponent } from './BlockFashion/Finanzas/comp/rec-lista/rec-lista.component';
import { RecAltaComponent } from './BlockFashion/Finanzas/comp/rec-alta/rec-alta.component';
import { RecVerComponent } from './BlockFashion/Finanzas/comp/rec-ver/rec-ver.component';
import { MovbancoComponent } from './BlockFashion/Finanzas/comp/movbanco/movbanco.component';
import { BcoVerComponent } from './BlockFashion/Finanzas/comp/bco-ver/bco-ver.component';
import { BcopagoVerComponent } from './BlockFashion/Finanzas/comp/bcopago-ver/bcopago-ver.component';
import { BcopagoListaComponent } from './BlockFashion/Finanzas/comp/bcopago-lista/bcopago-lista.component';
import { BcopagoCrearComponent } from './BlockFashion/Finanzas/comp/bcopago-crear/bcopago-crear.component';
import { BcopagoEditarComponent } from './BlockFashion/Finanzas/comp/bcopago-editar/bcopago-editar.component';
import { BrouConcilComponent } from './BlockFashion/Finanzas/comp/brou-concil/brou-concil.component';
import { RedpagoConcilComponent } from './BlockFashion/Finanzas/comp/redpago-concil/redpago-concil.component';
import { RedpagoMovComponent } from './BlockFashion/Finanzas/comp/redpago-mov/redpago-mov.component';
import { GastoListaComponent } from './BlockFashion/Finanzas/comp/gasto-lista/gasto-lista.component';
import { GastoAltaComponent } from './BlockFashion/Finanzas/comp/gasto-alta/gasto-alta.component';
import { GastoVerComponent } from './BlockFashion/Finanzas/comp/gasto-ver/gasto-ver.component';
import { PlanillaComponent } from './BlockFashion/Finanzas/comp/planilla/planilla.component';
import { OtroVerComponent } from './BlockFashion/Finanzas/comp/otro-ver/otro-ver.component';
import { OtroAltaComponent } from './BlockFashion/Finanzas/comp/otro-alta/otro-alta.component';
import { AbogadosComponent } from './BlockFashion/Organizacion/comp/abogados/abogados.component';
import { HelpnucComponent } from './BlockFashion/Tools/comp/helpnuc/helpnuc.component';
import { HelpafiComponent } from './BlockFashion/Tools/comp/helpafi/helpafi.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { VermensajesComponent } from './BlockFashion/Tools/comp/vermensajes/vermensajes.component';
import { RecNucleoComponent } from './BlockFashion/Finanzas/comp/rec-nucleo/rec-nucleo.component';
import { NucleopadronComponent } from './BlockFashion/Afiliados/comp/nucleopadron/nucleopadron.component';
import { RecAfiliadoComponent } from './BlockFashion/Finanzas/comp/rec-afiliado/rec-afiliado.component';
import { MailComponent } from './BlockFashion/Organizacion/comp/mail/mail.component';
import { DownloadFileService } from './BlockFashion/Organizacion/serv/download-file.service';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ProductoComponent } from './BlockFashion/Admin/comp/producto/producto.component';
import { AsigProductoComponent } from './BlockFashion/Afiliados/comp/asig-producto/asig-producto.component';

import { VerProductComponent } from './BlockFashion/Organizacion/comp/ver-product/ver-product.component';
import { PromimoNucleoComponent } from './BlockFashion/Admin/comp/proximo-nucleo/proximo-nucleo.component';
import { DepartamentoPipe } from './BlockFashion/Admin/pipes/departamento.pipe';
import { CotizantesComponent } from './BlockFashion/Admin/comp/cotizantes/cotizantes.component';
import { ComprobarPadronComponent } from './BlockFashion/Afiliados/comp/comprobar-padron/comprobar-padron.component';
import { ControlPadronComponent } from './BlockFashion/Organizacion/comp/control-padron/control-padron.component';




export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    FooterComponent,
    PanelComponent,
    FloatSubMenuComponent,

    DashboardV1Page,
    DashboardV2Page,
    DashboardV3Page,
    EmailInboxPage,
    EmailComposePage,
    EmailDetailPage,
    WidgetPage,
    PageBlank,
    PageFooter,
    PageWithoutSidebar,
    PageSidebarRight,
    PageSidebarMinified,
    PageFullHeight,
    PageTwoSidebar,
    PageSidebarWide,
    PageSidebarLight,
    PageSidebarTransparent,
    PageTopMenu,
    PageMixedMenu,
    PageBoxedLayout,
    PageMegaMenu,
    BoxedLayoutMixedMenu,
    UIGeneralPage,
    UITypographyPage,
    UITabsAccordionsPage,
    UIModalNotificationPage,
    UIWidgetBoxesPage,
    UIMediaObjectPage,
    UIButtonsPage,
    UIIconsPage,
    UISimpleLineIconsPage,
    UIIoniconsPage,
    UILanguageIconPage,
    UISocialButtonsPage,
    Bootstrap4Page,
    CalendarPage,
    FormStuffPage,
    MapPage,
    GalleryV1Page,
    GalleryV2Page,
    ExtraTimelinePage,
    ExtraComingSoonPage,
    ExtraSearchResultsPage,
    ExtraInvoicePage,
    ExtraErrorPage,
    ExtraProfilePage,
    LoginV1Page,
    LoginV2Page,
    LoginV3Page,
    RegisterV3Page,
    HelperCssPage,
    ChartNgxPage,
    ChartD3Page,
    TableBasicPage,
    TableDataPage,
    LogppalComponent,
    DatosEditarComponent,
    InvswalComponent,
    UsuListaComponent,
    UsuCrearComponent,
    UsuEditarComponent,
    UsuPassComponent,
    UsuCtaComponent,
    RolListaComponent,
    RolCrearComponent,
    RolCeditarComponent,
    MonListaComponent,
    MonEditarComponent,
    MonCrearComponent,
    MainpageComponent,
    SalirComponent,
    TcamListaComponent,
    TcamCrearComponent,
    TcamEditarComponent,
    TcamHoyComponent,
    CiudListaComponent,
    CiudEditarComponent,
    CiudCrearComponent,
    CargosComponent,
    ViapagoComponent,
    NucleoListaComponent,
    NucleoEditarComponent,
    PruebasComponent,
    AfilListaComponent,
    AfilEditarComponent,
    LocCrearComponent,
    SolicitudComponent,
    TipoactComponent,
    EventosComponent,
    EveCrearComponent,
    EveEditarComponent,
    DigitsDirective,
    OnlydigitsDirective,
    EveManagerComponent,
    AfilVerComponent,
    CostosComponent,
    EveUsuarioComponent,
    EventosUsuComponent,
    CitaPedirComponent,
    CitalegalComponent,
    CitaCrearComponent,
    CitaEditarComponent,
    CitaVerafiComponent,
    CitaVernucComponent,
    CitaVeraboComponent,
    QrComponent,
    RecListaComponent,
    RecNucleoComponent,
    RecAltaComponent,
    RecVerComponent,
    MovbancoComponent,
    BcoVerComponent,
    BcopagoVerComponent,
    BcopagoListaComponent,
    BcopagoCrearComponent,
    BcopagoEditarComponent,
    BrouConcilComponent,
    RedpagoConcilComponent,
    RedpagoMovComponent,
    GastoListaComponent,
    GastoAltaComponent,
    GastoVerComponent,
    PlanillaComponent,
    OtroVerComponent,
    OtroAltaComponent,
    AbogadosComponent,
    HelpnucComponent,
    HelpafiComponent,
    VermensajesComponent,
    NucleopadronComponent,
    RecAfiliadoComponent,
    MailComponent,
    ProductoComponent,
    AsigProductoComponent,
    VerProductComponent,
    PromimoNucleoComponent,
    DepartamentoPipe,
    CotizantesComponent,
    ComprobarPadronComponent,
    ControlPadronComponent,
  ],
  imports: [
    AppRoutingModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyC5gJ5x8Yw7qP_DqvNq3IdZi2WUSiDjskk' }),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NgxQRCodeModule,
    TableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
          useFactory: createTranslateLoader, // exported factory function needed for AoT compilation
          deps: [HttpClient]
      }
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CountdownModule,
    ChartsModule,
    FullCalendarModule,
    FormsModule,
    HighlightJsModule,
    LoadingBarRouterModule,
    MatSortModule,
    MatTableModule,
    NgbModule,
    NvD3Module,
    NgxChartsModule,
    NgxDatatableModule,
    Ng2TableModule,
    PerfectScrollbarModule,
    AngularMyDatePickerModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    TagInputModule,
    TrendModule,
    ScrollingModule
  ],
  providers: [
    DownloadFileService,
    DatePipe,
    EnvServiceProvider,
    Title, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
  {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [ AppComponent ]
})


export class AppModule {
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        var title = 'Sintep | ' + this.route.snapshot.firstChild.data['title'];
        this.titleService.setTitle(title);
      }
    });
  }
}

