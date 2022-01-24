import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU } from './menu';
import { MenuItem } from './menu.model';

import { SIDEBAR_COLOR } from '../layouts.model';
import { User } from '../../core/models/auth.models';
import { LoginService } from '../../opus/opus-users/services/login.service';
import { Dtomenu } from '../../opus/opus-users/models/DtoMenu';
import { Dtoitem } from '../../opus/opus-users/models/DtoItem';
import { MenuService } from '../../opus/opus-users/services/menu.service';
import { Usuario } from '../../opus/opus-users/models/usuario';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

/**
 * Sidebar Component
 */
export class SidebarComponent implements OnInit,AfterViewInit {

  @ViewChild('sideMenu') sideMenu!: ElementRef;
  menu: any;
  menuItems: MenuItem[] = [];
  gruposMenu: Dtomenu[] = [];
  itemsgrupos: Dtoitem[] = [];
  itemshijos: any[] = [];
  elusu: Usuario = new Usuario();

  isSidebar: any;

  constructor(private router: Router,
              private logsrv: LoginService,
              private mensrv: MenuService,
              public translate: TranslateService) {
    translate.setDefaultLang('en');
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    });
  }

  ngOnInit(): void {
    this.menuItems = [];
    this.gruposMenu = [];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    console.log("el usuario");
    console.log(this.elusu);
    if (this.elusu.idUser) {
      this.mensrv.getMenuUsu(this.elusu.idUser).subscribe(
        resu => {
          this.gruposMenu = resu;
          this.cargoGeneral();
        }
      );
    }
    this.isSidebar = SIDEBAR_COLOR;
    if (this.isSidebar === 'dark') {
      document.body.setAttribute('data-sidebar', 'dark');
    }
  }



  cargoGeneral() {

    this.menuItems.push(
      {
          id: 0,
          label: 'Menú',
          isTitle: true
        }, {
        id: 100,
        label: 'Inicio',
        icon: 'bx bx-home',
        link: '/home',
      }
    );
    console.log(this.gruposMenu);
    for (const grupo of this.gruposMenu) {
      let elite: MenuItem = { subItems:[]};
      if (grupo.items?.length != 0) {
        
        if (grupo.items && grupo.items.length > 1 ) {
          if (elite) {
            console.log("si entroooo");
            elite.label = grupo.descripcion;
              elite.icon = grupo.icono || "";
              elite.id = grupo.id || 0;


            for (const item of grupo.items) {
              if (item.url !== undefined && item.url.trim() !== '') {
                elite.subItems.push(
                  {
                    id: item.id,
                    label: item.descripcion,
                    link: item.url,
                    parentId: grupo.id
                  }
                );
              }
            }
            console.log("una elite");
            console.log(elite);
            this.menuItems.push(elite);
          } else {
            console.log("undefined");
          }
        } else {
          this.menuItems.push({
            id: grupo.id || 0,
            label: grupo.descripcion,
            icon: grupo.icono || "",
            link: grupo.items != undefined ? grupo.items[0].url || "" : "",
          });
        }

      }
    }
    console.log("salkimos menu ");
    console.log(this.menuItems);
  }
    // this.menuItems.push(
    //   {
    //     id: 0,
    //     label: 'Menú',
    //     isTitle: true
    //   }, {
    //   id: 1,
    //   label: 'Inicio',
    //   icon: 'bx bx-home',
    //   link: '/home',
    // },
    //   {
    //   id: 9,
    //   label: 'Laboratorio',
    //   icon: 'bx bx-dna',
    //   subItems: [
    //      {
    //       id: 91,
    //       label: 'Atributo',
    //       link: '/opus-labo/atributos-list',
    //       parentId: 9
    //     }
    //     , {
    //       id: 92,
    //       label: 'Tipos de Análisis',
    //       link: '/opus-labo/tipo-anls-list',
    //       parentId: 9
    //     }
    //     , {
    //       id: 93,
    //       label: 'Plantilla',
    //       link: '/opus-labo/plantillas-list',
    //       parentId: 9
    //     }

    //   ]
    //    },
    //   {
    //     id: 10,
    //     label: 'Administración',
    //     icon: 'bx bx-wrench',
    //     subItems: [
    //       {
    //         id: 101,
    //         label: 'Usuario',
    //         link: '/user/user-list',
    //         parentId: 10
    //       }, {
    //         id: 102,
    //         label: 'Roles',
    //         link: '/user/roles-list',
    //         parentId: 10
    //       }

    //     ]
    //   }

    // );



  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.menu = new MetisMenu('#side-menu');
    this._activateMenuDropdown();
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }
}


