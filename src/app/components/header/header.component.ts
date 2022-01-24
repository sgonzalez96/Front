import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy, OnInit } from '@angular/core';
import pageSettings from '../../config/page-settings';
import { Usuario } from '../../BlockFashion/Admin/models/usuario';
import { LoginService } from '../../BlockFashion/Tools/serv/login.service';
import { Router } from '@angular/router';
import { Dato } from '../../BlockFashion/Admin/models/dato';
import { DatosService } from '../../BlockFashion/Admin/services/datos.service';
import { UsuarioService } from '../../BlockFashion/Admin/services/usuario.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy, OnInit {
	@Input() pageSidebarTwo;
	@Output() toggleSidebarRightCollapsed = new EventEmitter<boolean>();
	@Output() toggleMobileSidebar = new EventEmitter<boolean>();
	@Output() toggleMobileRightSidebar = new EventEmitter<boolean>();
	  
	pageSettings = pageSettings;
	elusu: Usuario = new Usuario();
	elLang = '';
	usuimg = '';
	flag = '';
	idioma = '';
	previewUrl: any = null;
	vars = new Dato;
	lamarca = '';



	  mobileSidebarToggle() {
		  this.toggleMobileSidebar.emit(true);
	  }
	  mobileRightSidebarToggle() {
		  this.toggleMobileRightSidebar.emit(true);
	  }
	  toggleSidebarRight() {
		  this.toggleSidebarRightCollapsed.emit(true);
	  }
  
	  mobileTopMenuToggle() {
		this.pageSettings.pageMobileTopMenuToggled = !this.pageSettings.pageMobileTopMenuToggled;
	  }
  
	  mobileMegaMenuToggle() {
		this.pageSettings.pageMobileMegaMenuToggled = !this.pageSettings.pageMobileMegaMenuToggled;
	  }
  
	  ngOnDestroy() {
		this.pageSettings.pageMobileTopMenuToggled = false;
		this.pageSettings.pageMobileMegaMenuToggled = false;
	  }
	  

	  constructor(
		private logsrv: LoginService ,
		private datosrv: DatosService,
		private ususrv: UsuarioService) {
	}
	  
	
    ngOnInit() {
        setTimeout(() => {
            this.elusu = this.logsrv.getUsuarioFromStorage();
            this.usuimg = 'data:image/png;base64,' + this.elusu.foto;
			
            this.datosrv.getDato( '1').subscribe(
            resul => {
			  this.vars = resul;
			  this.previewUrl = 'data:image/png;base64,' + this.vars.logo;
			}
			);

		  }, 1000);
  
		  
		}

	  veoUsu() {
		  
	  }
  }
  