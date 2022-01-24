import { Component, OnInit } from '@angular/core';
import { TcamService } from '../../../Admin/services/tcam.service';
import { ValMon } from '../../../Admin/models/valmon';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { LoginService } from '../../serv/login.service';
import { Usuario } from '../../../Admin/models/usuario';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../Admin/services/usuario.service';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  fecha: Date = new Date();
  lista: ValMon[];
  elusu: Usuario;

  constructor(
    private tcamsrv: TcamService,
    private router: Router,
    private logsrv: LoginService,
    private ususerv: UsuarioService
  ) { }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    if (this.elusu.getNivel() === 0){
      this.router.navigate(['/eve-usuario']);
    }

    if (this.elusu.getNivel() > 50 ) {
      const fechoy  = formatDate(this.fecha, 'yyyy-MM-dd',"en-US");
      this.tcamsrv.getTCValMon(fechoy).subscribe(
        resval => {
          this.lista = resval;
          for (const cucu of this.lista) {
            if (cucu.tcid === 0) {
              this.router.navigate(['/tcam-hoy']);
            }
          }
        }
      );
    }

    if (this.elusu.getNivel() == 10 || this.elusu.getNivel() == 0 ) {
      //disparar servicio
      const promise: Promise<any | null> = new Promise((resolve,rejects)=>{
        this.ususerv.checkStatusPadron(this.elusu,this.elusu.getNivel()).subscribe(res=>{
          if (res.error) {
            resolve(res);
          }else if(res.message){
            rejects(null);
          }
         
        });
      });

      // check promise
      promise.then(res => {
        if (res != null) {
          Swal.fire("Alerta", res.error, "warning");
        } 
      }).catch(err=>{
        console.log("error al correr alerta del delegado" + err);
      })
    }
  }

}
