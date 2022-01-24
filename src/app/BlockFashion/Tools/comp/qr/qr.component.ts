import { Component, OnInit, ViewChild } from '@angular/core';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../serv/login.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {
  
  @ViewChild('felipe',null) elqr: any;
  cedula = '';
  objAfil: Afiliado;
  elusu: Usuario;
  url: string;


  constructor(
    private logsrv: LoginService) { }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.url = this.elusu.afinro.toString();
    console.log("la url",this.url);

  }

}
