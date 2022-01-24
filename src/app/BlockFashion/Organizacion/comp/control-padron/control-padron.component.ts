import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { Usuario } from '../../../Admin/models/usuario';
import { NucleosService } from '../../../Afiliados/serv/nucleos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-padron',
  templateUrl: './control-padron.component.html',
  styleUrls: ['./control-padron.component.css']
})
export class ControlPadronComponent implements OnInit, OnDestroy {

  //subscriptions
  $subs: Subscription[] = [];
  elusu: Usuario = new Usuario();

  //data
  listDataNucleo: Nucleo[]=[];

  constructor(
    private nucsrv: NucleosService,
    private logsrv: LoginService,
  ) { }


  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.getCurrentNucleo();
  }

    //get current nucleo 
    getCurrentNucleo() {
      Swal.fire({ titleText: "Cargando" });
      Swal.showLoading();
      const promise = new Promise<Nucleo[] | null>((resolve, reject) => {
        this.$subs.push(
         this.nucsrv.getNucleosStatus("Comprobar").subscribe(res=>{
           if (res) {
             resolve(res);
           }else{
             reject(null);
           }
         })
        )
  
      });
  
       //await for promise execute 
       promise.then(res => {
        Swal.close();
        if (res != null) {
          this.listDataNucleo = res
        } else {
          Swal.fire("", "No se encontraron datos", "info");
        }
      })
  
    }

    //check success
    checkSuccess(){
      
    }
  
  
   
  

  ngOnDestroy(): void {
    this.$subs.forEach(res=>{res.unsubscribe()});
  }
}
