import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { IProximoNucleo } from '../../models/proximo-nucleo';
import { ProximoNucleoService } from '../../services/proximo-nucleo.service';

@Component({
  selector: 'app-proximo-nucleo',
  templateUrl: './proximo-nucleo.component.html',
  styleUrls: ['./proximo-nucleo.component.css']
})
export class PromimoNucleoComponent implements OnInit, OnDestroy {

  //subcribes 
  public $subs: Subscription[]=[];

  // data table 
  public listDataTable: IProximoNucleo[] = [];
  public currentItem: number;

  constructor(private _proxNucleo: ProximoNucleoService, private modalService:NgbModal) { }
  ngOnDestroy(): void {
    this.$subs.forEach((res)=>{
      res.unsubscribe();
    })
  }

  ngOnInit() {
    this.getAllProximoNucleo();
    

  }

  getAllProximoNucleo() {
    this.$subs.push(
      this._proxNucleo.findAllProximos().subscribe((res) => {
        if (res) {
          this.listDataTable = res;
        }
      }, (err) => {
        console.log(err);
        Swal.fire("Error", "Los datos no fueron encontrados", "error");
      })
    );

    
  }

  popupProximo(content, proximo:number, index:number) {
    console.log(proximo);
    console.log(index);
    this.currentItem = proximo;
    this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: false, centered: true }).result.then((result) => {
    
    }, (data) => {
      console.log(this.currentItem);
      this.listDataTable[index].proximo = this.currentItem;
      this.saveData(this.listDataTable[index]);
    });
  }

  //save 
  saveData(data: IProximoNucleo){
    this.$subs.push(
      this._proxNucleo.saveProximo(data).subscribe((res)=>{
      if (res) {
        Swal.fire("Exito","Valor Guardado","success");
      };
    },(error)=>{
      console.log(error);
      Swal.fire("Error", "El dato no pudo ser guardado", "error");
    })
    );
    
  }

  //refresh item
  refresh(){
    Swal.fire({
      titleText:"Cargando"
    });
    Swal.showLoading();
    this.$subs.push(
      this._proxNucleo.actualizo().subscribe(()=>{
      Swal.close();
      Swal.fire("Exito","Campo actualizado","success")
      this.getAllProximoNucleo();
    },(err) => {
      console.log(err);
      Swal.fire("Error", "No se pudo actualizar", "error");
    })
    );
    
  }

}




