import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Afiliado } from './../../models/afiliado';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { Nucleo } from '../../models/nucleo';
import { AfiliadosService } from '../../serv/afiliados.service';
import { NucleosService } from '../../serv/nucleos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-comprobar-padron',
  templateUrl: './comprobar-padron.component.html',
  styleUrls: ['./comprobar-padron.component.css']
})
//*Este componente se va a llamar desde dos lugares distintos
//y se comportara distinto para cada origin
 //
export class ComprobarPadronComponent implements OnInit, OnDestroy {
  //subcriptions
  private $subs: Subscription[] = [];

  //data nucleo 
  elusu: Usuario = new Usuario();
  currentNucleo: Nucleo = new Nucleo;
  listaAfil: Afiliado[] = [];
  isOrg : boolean = false;

  constructor(
    private afisrv: AfiliadosService,
    private logsrv: LoginService,
    private modalService: NgbModal,
    private _nucleo: NucleosService,
    private actRout: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.checkRol();
    console.log(this.isOrg);
    if (!this.isOrg) {
      this.getCurrentNucleoByDelegado();
    }else{
      this.actRout.paramMap.subscribe(
        params => {
          let id = params.get('origin');
          console.log(id);
          this.getNucleoById(id);
        }
      );
    }
  }
  getNucleoById(id: string) {
    Swal.fire({ titleText: "Cargando" });
    Swal.showLoading();
    const promise = new Promise<boolean>((resolve, reject) => {
      this.$subs.push(
        this._nucleo.getNucleo(id).subscribe(
          resdele => {
            console.log(resdele); 
              if (resdele) {
                this.currentNucleo = resdele;
                resolve(true);
              }else{
                reject(false);
              }
            

          }
        )
      )

    });

     //await for promise execute 
     promise.then(res => {
      Swal.close();
      if (res) {
        this.searchData();
      } else {
        Swal.fire("", "No se encontraron datos", "info");
      }
    })
  }

  checkRol(){
    if (this.elusu) {
      for (let i = 0; i < this.elusu.roles.length; i++) {
        if (this.elusu.roles[i].nivel == 50 || this.elusu.roles[i].nivel == 90 ) {
          this.isOrg = true;
        }
        
      }
    }
  }

  //get current nucleo 
  getCurrentNucleoByDelegado() {
    Swal.fire({ titleText: "Cargando" });
    Swal.showLoading();
    const promise = new Promise<boolean>((resolve, reject) => {
      this.$subs.push(
        this.afisrv.getNucAfiliado(this.elusu.afinro.toString().trim()).subscribe(
          resdele => {
            console.log(resdele);
            for (const dele of resdele) {
              if (dele.nucleo.delegado1 === this.elusu.afinro ||
                dele.nucleo.delegado2 === this.elusu.afinro) {
                this.currentNucleo = dele.nucleo;
                resolve(true);
                break;
              }else{
                reject(false);
              }
            }

          }
        )
      )

    });

     //await for promise execute 
     promise.then(res => {
      Swal.close();
      if (res) {
        this.searchData();
      } else {
        Swal.fire("", "No se encontraron datos", "info");
      }
    })

  }


  searchData() {
    this.afisrv.getAfiNucleo(this.currentNucleo.id.toString()).subscribe(
      resfafa => {
        console.log(resfafa);
        for (const fafa of resfafa) {
          this.listaAfil.push(fafa.afiliado);
        }
      }
    );

   
  }

  //check padron
  checkAfil(content,item: Afiliado) {
  this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
  }, (reason:string) => {
    if (this.isOrg) {
      item.status = "T";

    }else{
      item.status = "P";
    }
    item.notas = reason;
    this.afisrv.checkAfilPadron(item).subscribe();
  });
  }

  //back
  back(){
    this.router.navigate(['/control-padron']);
  }

  // send check 
  checkPadron(){
    Swal.fire({
      titleText: "Atencion",
      text:" Estas seguro de ejecutar esta accion",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(res=>{
      if (res.value) {
        if (this.isOrg) {
          this.currentNucleo.padron = "Comprobado";
        }else{
          this.currentNucleo.padron = "Comprobar";
        }
        this.$subs.push(
          this._nucleo.checkNucleoPadron(this.currentNucleo).subscribe(res=>{
            if (res) {
              console.log(res);
            }
          })
        );
        
      }
    });
  }
  


  ngOnDestroy(): void {
    this.$subs.forEach(res => {
      res.unsubscribe();
    })
  }

}
