import { title } from 'process';
import { group, animate, query, style, trigger, transition, state } from '@angular/animations';
import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, OnInit, AfterViewChecked } 		 from '@angular/core';
import * as global 	from '../../config/globals';
import pageMenus from '../../config/page-menus';
import pageSettings from '../../config/page-settings';
import { LoginService } from '../../BlockFashion/Tools/serv/login.service';
import { DatosService } from '../../BlockFashion/Admin/services/datos.service';
import { Usuario } from '../../BlockFashion/Admin/models/usuario';
import { Dato } from '../../BlockFashion/Admin/models/dato';
import { Rol } from '../../BlockFashion/Admin/models/rol';
import { AfilNucleo } from '../../BlockFashion/Afiliados/models/afilnuc';
import { AfiliadosService } from '../../BlockFashion/Afiliados/serv/afiliados.service';
import { Nucleo } from '../../BlockFashion/Afiliados/models/nucleo';
import { Afiliado } from '../../BlockFashion/Afiliados/models/afiliado';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('expandCollapse', [
      state('expand', style({ height: '*', overflow: 'hidden', display: 'block' })),
      state('collapse', style({ height: '0px', overflow: 'hidden', display: 'none' })),
      state('active', style({ height: '*', overflow: 'hidden', display: 'block' })),
      transition('expand <=> collapse', animate(100)),
      transition('active => collapse', animate(100))
    ])
  ]
})

export class SidebarComponent implements AfterViewChecked {
  navProfileState = 'collapse';
  @ViewChild('sidebarScrollbar', { static: false }) private sidebarScrollbar: ElementRef;
	@Output() toggleSidebarMinified = new EventEmitter<boolean>();
	@Output() hideMobileSidebar = new EventEmitter<boolean>();
	@Output() setPageFloatSubMenu = new EventEmitter();
	@Input() pageSidebarTransparent;
	@Input() pageSidebarMinified;

	menus = pageMenus;
	pageSettings = pageSettings;
	pageFloatSubMenu;
	pageFloatSubMenuHide;
	pageFloatSubMenuHideTime = 250;
	pageFloatSubMenuTop;
	pageFloatSubMenuLeft = '60px';
	pageFloatSubMenuRight;
  pageFloatSubMenuBottom;
  pageFloatSubMenuArrowTop;
  pageFloatSubMenuArrowBottom;
  pageFloatSubMenuLineTop;
  pageFloatSubMenuLineBottom;
  pageFloatSubMenuOffset;

	mobileMode;
	desktopMode;
	scrollTop;

  toggleNavProfile() {
    if (this.navProfileState == 'collapse') {
      this.navProfileState = 'expand';
    } else {
      this.navProfileState = 'collapse';
    }
  }

	toggleMinified() {
		this.toggleSidebarMinified.emit(true);
		this.navProfileState = 'collapse';
		this.scrollTop = 40;
	}

	calculateFloatSubMenuPosition() {
		var targetTop = this.pageFloatSubMenuOffset.top;
    var direction = document.body.style.direction;
    var windowHeight = window.innerHeight;

    setTimeout(() => {
      let targetElm = <HTMLElement> document.querySelector('.float-sub-menu-container');
      let targetSidebar = <HTMLElement> document.getElementById('sidebar');
      var targetHeight = targetElm.offsetHeight;
      this.pageFloatSubMenuRight = 'auto';
      this.pageFloatSubMenuLeft = (this.pageFloatSubMenuOffset.width + targetSidebar.offsetLeft) + 'px';

      if ((windowHeight - targetTop) > targetHeight) {
        this.pageFloatSubMenuTop = this.pageFloatSubMenuOffset.top + 'px';
        this.pageFloatSubMenuBottom = 'auto';
        this.pageFloatSubMenuArrowTop = '20px';
        this.pageFloatSubMenuArrowBottom = 'auto';
        this.pageFloatSubMenuLineTop = '20px';
        this.pageFloatSubMenuLineBottom = 'auto';
      } else {
        this.pageFloatSubMenuTop = 'auto';
        this.pageFloatSubMenuBottom = '0';

        var arrowBottom = (windowHeight - targetTop) - 21;
        this.pageFloatSubMenuArrowTop = 'auto';
        this.pageFloatSubMenuArrowBottom = arrowBottom + 'px';
        this.pageFloatSubMenuLineTop = '20px';
        this.pageFloatSubMenuLineBottom = arrowBottom + 'px';
      }
    }, 0);
	}

	showPageFloatSubMenu(menu, e) {
	  if (this.pageSettings.pageSidebarMinified) {
      clearTimeout(this.pageFloatSubMenuHide);

      this.pageFloatSubMenu = menu;
      this.pageFloatSubMenuOffset = e.target.getBoundingClientRect();
      this.calculateFloatSubMenuPosition();
    }
	}

	hidePageFloatSubMenu() {
	  this.pageFloatSubMenuHide = setTimeout(() => {
	    this.pageFloatSubMenu = '';
	  }, this.pageFloatSubMenuHideTime);
	}

	remainPageFloatSubMenu() {
	  clearTimeout(this.pageFloatSubMenuHide);
	}

	expandCollapseSubmenu(currentMenu, allMenu, active) {
		for (let menu of allMenu) {
			if (menu != currentMenu) {
				menu.state = 'collapse';
			}
		}
		if (active.isActive) {
		  currentMenu.state = (currentMenu.state && currentMenu.state == 'collapse') ? 'expand' : 'collapse';
		} else {
		  currentMenu.state = (currentMenu.state && currentMenu.state == 'expand') ? 'collapse' : 'expand';
		}
	}

	@HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
		  this.hideMobileSidebar.emit(true);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollTop = (this.pageSettings.pageSidebarMinified) ? event.srcElement.scrollTop + 40 : 0;
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem('sidebarScroll', event.srcElement.scrollTop);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof(Storage) !== 'undefined' && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }

  constructor(
    private eRef: ElementRef,
    private logsrv: LoginService ,
    private afisrv: AfiliadosService,
    private datosrv: DatosService) {

      if (window.innerWidth <= 767) {
        this.mobileMode = true;
        this.desktopMode = false;
      } else {
        this.mobileMode = false;
        this.desktopMode = true;
      }
  }

  elusu: Usuario = new Usuario();
  usuimg = '';
  vars = new Dato;
  varopt: string[] = [];
  elid: string;
  elrol: Rol;
  elnucleo = new Nucleo();
  elafil = new Afiliado();
  vaPago = false;

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    setTimeout(() => {
      this.elusu = this.logsrv.getUsuarioFromStorage();
      this.elrol = this.elusu.getNivelRol();
      if (this.elusu.afinro != null && this.elusu.afinro !== 0) {
        this.afisrv.getNucAfiliado(this.elusu.afinro.toString()).subscribe(
          resafi => {
            for (const resa of resafi) {
              if (resa.cotizante) {
                this.elnucleo = resa.nucleo;
                this.elafil = resa.afiliado;
                if (this.elrol.nivel === 0 && this.elnucleo.id === 1) {
                  this.vaPago = true;
                }
              }
              if (resa.nucleo.delegado1 === this.elusu.afinro || resa.nucleo.delegado2 === this.elusu.afinro) {
                  this.elnucleo = resa.nucleo;
                  this.elafil = resa.afiliado;
                  this.vaPago = true;
                  break;
              }
            }
            this.lacargamos();
          }
        );
      } else {
        this.lacargamos();
      }


    }, 1000);


    this.datosrv.getDato('1').subscribe(
    resul => {
      this.vars = resul;
    });
  }

  lacargamos(){
    this.usuimg = 'data:image/png;base64,' + this.elusu.foto;
      this.menus = [];

      //todo
      if (this.elusu.getNivel() === 90) {
        this.cargoMenuAfiliado();
        this.cargoMenuAfiliados();
        this.cargoMenuLegal();
        this.cargoMenuOrganizacion();
        this.cargoMenuFinanzas();
        this.cargoMenuAdmin();
        this.cargoMenuSuper();
      }

      if (this.elusu.getNivel() === 50 || this.elusu.getNivel() === 45) {
        this.cargoMenuAfiliado();
        this.cargoMenuAfiliados();
        if (this.elusu.getNivel() === 50) {
          this.cargoMenuLegal();
        }
        this.cargoMenuOrganizacion();
        if (this.elusu.getNivel() === 50) {
          this.cargoMenuAdmin();
        }
      }

      if (this.elusu.getNivel() === 40) {
        this.cargoMenuAfiliado();
        this.cargoMenuLegal();
      }
      if (this.elusu.getNivel() === 0) {
        this.cargoMenuAfiliado();
      }

      if (this.elusu.getNivel() === 10) {
        this.cargoMenuAfiliado();
        this.varopt[0] = 'Delegada/o';
        this.varopt[1] = 'Nucleo';
        this.varopt[2] = 'Afiliados/as';
        this.varopt[3] = 'Asignar productos';
        this.varopt[4] = 'Padron';
        this.menus.push({
          'icon': 'fa fa-cubes',
          'title': this.varopt[0],
          'url': '',
          'caret': 'true',
          'submenu': [
            {
              'url': '/nucleos/',
              'title': this.varopt[1]
            },
            {
              'url': '/afiliados',
              'title': this.varopt[2]
            },
            {
              'url': '/asig-producto',
              'title': this.varopt[3]
            },
            {
              'url': '/comprobar-padron/0',
              'title': this.varopt[4]
            }

          ]});

      }
  }

  cargoMenuAfiliado(){
    this.varopt[0] = 'Mis opciones';
    this.varopt[1] = 'Ficha';
    this.varopt[2] = 'Eventos';
    this.varopt[3] = 'Consultas Laborales';
    this.varopt[4] = 'Desplegar QR';
    if (this.vaPago) {
      this.varopt[5] = 'Pago bancario';
      this.menus.push({
        'icon': 'fa fa-address-card',
        'title': this.varopt[0],
        'url': '',
        'caret': 'true',
        'submenu': [
          {
            'url': '/afil-editar/'+ this.elusu.afinro,
            'title': this.varopt[1]
          },
          {
            'url': '/eve-usuario',
            'title': this.varopt[2]
          },
          {
            'url': '/pedir-cita',
            'title': this.varopt[3]
          },
          {
            'url': '/qrafiliado',
            'title': this.varopt[4]
          },
          {
            'url': '/bcopagos',
            'title': this.varopt[5]
          },
        ]});
    } else {
      this.menus.push({
        'icon': 'fa fa-address-card',
        'title': this.varopt[0],
        'url': '',
        'caret': 'true',
        'submenu': [
          {
            'url': '/afil-editar/'+ this.elusu.afinro,
            'title': this.varopt[1]
          },
          {
            'url': '/eve-usuario',
            'title': this.varopt[2]
          },
          {
            'url': '/pedir-cita',
            'title': this.varopt[3]
          },
          {
            'url': '/qrafiliado',
            'title': this.varopt[4]
          },
        ]});
    }

  }


  cargoMenuSuper() {

//todo    this.cargoMenuProductos();


    this.varopt[0] = 'Configuración';
    this.varopt[1] = 'Usuarios/as';
    this.varopt[2] = 'Roles';
    this.varopt[3] = 'Datos principales';
    this.varopt[4] = 'Control Integridad';

    this.menus.push({
          'icon': 'fa fa-id-card',
          'title': this.varopt[0],
          'url': '',
          'caret': 'true',
          'submenu': [
            {
              'url': '/users',
              'title': this.varopt[1]
            },
            {
              'url': '/roles',
              'title': this.varopt[2]
            },
            {
              'url': '/datos',
              'title': this.varopt[3]
            },
            {
              'url': '/chequeos',
              'title': this.varopt[4]
            },
          ]});
  }


  cargoMenuAfiliados() {
    this.varopt[0] = 'Afiliados/as';
    this.varopt[1] = 'Nucleos';
    this.varopt[2] = 'Ficha nucleo';
    this.varopt[3] = 'Padrón nucleos';
    this.varopt[4] = 'Afiliadas/os';
    this.varopt[5] = 'Ficha Afliadas/os';



    this.menus.push({
      'icon': 'fa fa-user-plus',
      'title': this.varopt[0],
      'url': '',
      'caret': 'true',
      'submenu': [{
        'url': '/nucleos',
        'title': this.varopt[1]
      },
      {
        'url': '/nucleo-editar/0',
        'title': this.varopt[2]
      },
      {
        'url': '/nucleo-padron',
        'title': this.varopt[3]
      },
      {
        'url': '/afiliados',
        'title': this.varopt[4]
      },
      {
        'url': '/afil-editar/0',
        'title': this.varopt[5]
      }
      ]
    });
  }


  cargoMenuAdmin() {
    this.varopt[0] = 'Administracion';
    this.varopt[1] = 'Ciudades';
    this.varopt[2] = 'Cargos Profesionales';
    this.varopt[3] = 'Productos';
    this.varopt[4] = 'Proximo Nucleo';

    this.menus.push({
      'icon': 'fa fa-archive',
      'title': this.varopt[0],
      'url': '',
      'caret': 'true',
      'submenu': [
      {
        'url': '/ciudades',
        'title': this.varopt[1]
      },
      {
        'url': '/cargos',
        'title': this.varopt[2]
      },
      {
        'url': '/producto',
        'title': this.varopt[3]
      },
      {
        'url': '/proximo-nucleo',
        'title': this.varopt[4]
      }
      ]
    });
  }

  cargoMenuOrganizacion() {
    this.varopt[0] = 'Organización';
    this.varopt[1] = 'Administrar Eventos ';
    this.varopt[2] = 'Eventos de un usuario';
    this.varopt[3] = 'Tipos de Actividades';
    this.varopt[4] = 'Finanzas';
    this.varopt[5] = 'Pagos Individuales';
    this.varopt[6] = 'Ver Productos';
    this.varopt[7] = 'Cotizantes';
    this.varopt[8] = 'Control Padrones';

    this.menus.push({
      'icon': 'fa fa-calendar-alt',
      'title': this.varopt[0],
      'url': '',
      'caret': 'true',
      'submenu': [{
        'url': '/eventos',
        'title': this.varopt[1]
      },
      {
        'url': '/eventos-usu',
        'title': this.varopt[2]
      },
      {
        'url': '/tipoact',
        'title': this.varopt[3]
      },
        {'url': '/ver-product',
        'title': this.varopt[6]
      }
      ,
        {'url': '/cotizantes',
        'title': this.varopt[7]
      }
      ,
        {'url': '/control-padron',
        'title': this.varopt[8]
      }
      ]
    });

    if (this.elusu.getNivel() != 90) {
      this.menus.push(
      {'icon': 'fa fa-calendar-alt',
      'title': this.varopt[4],
      'url': '',
      'caret': 'true',
      'submenu': [{
        'url': '/rec-afiliado',
        'title': this.varopt[5]
      }]}
      )
    }
  }

  cargoMenuLegal() {
    this.varopt[0] = 'Consultas Laborales';
    this.varopt[1] = 'Calendario de consultas';
    this.varopt[2] = 'Consulta personas';
    this.varopt[3] = 'Consulta nucleos';
    this.varopt[4] = 'Consulta abogadas/os';
    this.varopt[5] = 'Lista de abogadas/os';
    this.varopt[6] = 'Cotizantes';

    this.menus.push({
      'icon': 'fa fa-balance-scale',
      'title': this.varopt[0],
      'url': '',
      'caret': 'true',
      'submenu': [{
        'url': '/citas',
        'title': this.varopt[1]
      },
      {
        'url': '/cita-verafi',
        'title': this.varopt[2]
      },
      {
        'url': '/cita-vernuc',
        'title': this.varopt[3]
      },
      {
        'url': '/cita-verabo',
        'title': this.varopt[4]
      },
      {
        'url': '/abogados',
        'title': this.varopt[5]
      },
      {
        'url': '/cotizantes',
        'title': this.varopt[6]
      },
      ]
    });
  }

  cargoMenuFinanzas() {
    this.varopt[0] = 'Finanzas';
    this.varopt[1] = 'Recibos';
    this.varopt[2] = 'Movimientos';
    this.varopt[3] = 'Pagos indicados';
    this.varopt[4] = 'Conciliacion';
    this.varopt[5] = 'Monedas';
    this.varopt[6] = 'Tipo de Cambio';
    this.varopt[7] = 'Vías de pago';
    this.varopt[8] = 'Movimientos';
    this.varopt[9] = 'Conciliacion';
    this.varopt[10]= 'Gastos';
    this.varopt[11]= 'Planilla contable';
    this.varopt[12]= 'Cotizantes';

    this.menus.push({
      'icon': 'fa fa-chart-line',
      'title': this.varopt[0],
      'url': '',
      'caret': 'true',
      'submenu': [{
        'url': '/recibos',
        'title': this.varopt[1]
      },
      {
        'url': '/rec-nucleo',
        'title': "Recibos por núcleo"
      },
      {
        'url': '/rec-afiliado',
        'title': "Pagos Individuales"
      },
      {
        'url': '/bcopagos',
        'title': this.varopt[3]
      },
      {
        'url': '/gastos',
        'title': this.varopt[10]
      },
      {
        'url': '/planilla',
        'title': this.varopt[11]
      },
      {
        'url': '/cotizantes',
        'title': this.varopt[12]
      },
      {
      'title': 'BROU',
      'url': '',
      'submenu': [
        {
        'url': '/movbanco',
        'title': this.varopt[2]
        },
        {
        'url': '/brouconcil',
        'title': this.varopt[4]
        }
        ]
      },
      {
        'title': 'REDPAGOS',
        'url': '',
        'submenu': [
          {
          'url': '/redpagomov',
          'title': this.varopt[8]
          },
          {
          'url': '/redpagoconcil',
          'title': this.varopt[9]
          }
          ]
        },
      {
      'title': 'Otros',
      'url': '',
      'submenu': [
      {
        'url': '/monedas',
        'title': this.varopt[5]
      },
      {
        'url': '/tcam-hoy',
        'title': this.varopt[6]
      },
      {
        'url': '/vias',
        'title': this.varopt[7]
      }
      ]
    }
    ]
    });
  }

}
