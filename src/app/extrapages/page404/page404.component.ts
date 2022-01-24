import { Component, OnInit } from '@angular/core';
import { LAYOUT_MODE } from '../../layouts/layouts.model';
import {Location} from '@angular/common';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})

/**
 * Page-400 Component
 */
export class Page404Component implements OnInit {

  layout_mode!: string;

  constructor( private _location: Location) { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
  }

  volver(){
    this._location.back();
  }

}
