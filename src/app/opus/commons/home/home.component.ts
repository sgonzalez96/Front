import { Component, OnInit } from '@angular/core';
import { Snotify, SnotifyService } from 'ng-snotify';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _snotify: SnotifyService) { }

  ngOnInit(): void {
  }

  showNotification(){
    let toast = this._snotify.success("accion completada",{
      showProgressBar:false,
      type: 'warning'
    });

    this._snotify.success('Example body content', 'Example title', {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true
    });
    
    toast.on( "beforeHide", (toast: Snotify) => {
      
      toast.body = "Se va a cerrar";
      
    });
    


    this._snotify.confirm('Si lo desea puede cancelar', 'Procesando', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {text: 'SI', action: () => console.log('Clicked: Yes'), bold: true},
        {text: 'Close', action: (toast) => {console.log('Clicked: No'); }, bold: true},
      ]
    });
  }

}
