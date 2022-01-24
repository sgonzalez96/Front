import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LAYOUT_MODE } from '../../../layouts/layouts.model';

@Component({
  selector: 'app-error-http',
  templateUrl: './error-http.component.html',
  styleUrls: ['./error-http.component.scss']
})

/**
 * Page-500 Component
 */
export class ErrorHttpComponent implements OnInit {

  layout_mode!: string
  public error: string = "";
  constructor(private _location: Location, private _activeRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // bought params from url
    this.getParams();
    this.layout_mode = LAYOUT_MODE
    if(this.layout_mode === 'dark') {
      document.body.setAttribute("data-layout-mode", "dark");
    }
  }

  getParams(){
    this._activeRouter.paramMap.subscribe((res)=>{
      if (res.has('id')) {
        let parameter: string = res.get('id') || "";
        this.error = parameter;
      }
    })
  }

  // to back 
  backUrl(){
    if (this.error == "401") {
      this.router.navigate(['/']);
    }else{
      this._location.back();
    }
  }

}
