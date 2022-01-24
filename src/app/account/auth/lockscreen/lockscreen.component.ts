import { Component, OnInit } from '@angular/core';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})

/**
 * Lock-Screen Component
 */
export class LockscreenComponent implements OnInit {

  layout_mode!: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
  }

}
