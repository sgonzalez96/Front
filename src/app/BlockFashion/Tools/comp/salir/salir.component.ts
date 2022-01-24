import { Component, OnInit, OnDestroy } from '@angular/core';
import pageSettings from '../../../../config/page-settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salir',
  templateUrl: './salir.component.html',
  styleUrls: ['./salir.component.css']
})
export class SalirComponent implements OnInit, OnDestroy {
  pageSettings = pageSettings;

  constructor(
    private router: Router,
    ) {
    this.pageSettings.pageEmpty = true;
  }

  ngOnInit() {
    sessionStorage.clear();
  }

  ngOnDestroy() {
    this.pageSettings.pageEmpty = false;
  }

  formSubmit(){
    this.router.navigate(['/logppal']);
  }
}