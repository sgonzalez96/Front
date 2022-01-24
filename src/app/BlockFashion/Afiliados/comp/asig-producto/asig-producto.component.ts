import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfilProdDTO, Order } from './../../models/AfilProdDTO';
import { AfiliadosService } from './../../serv/afiliados.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { Dato } from '../../../Admin/models/dato';
import { Producto } from '../../../Admin/models/producto';
import { ProductoService } from '../../../Admin/services/producto.service';
import { DatePipe } from '@angular/common';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { Nucleo } from '../../models/nucleo';
import { IReportAfilProd } from '../../models/reportAfilProd';
import { DelegadosService } from '../../serv/delegados.service';
import { Afiliado } from '../../models/afiliado';
import { NucleosService } from '../../serv/nucleos.service';

@Component({
  selector: 'app-asig-producto',
  templateUrl: './asig-producto.component.html',
  styleUrls: ['./asig-producto.component.css']
})
export class AsigProductoComponent implements OnInit {

  elusu: Usuario = new Usuario();
  lista: AfilProdDTO[] = [];
  lista_fil: AfilProdDTO[] = [];
  objDato: Dato;
  public currentAfil: AfilProdDTO;
  public currentOrder: Order;
  public listProd: Producto[]=[]; // list product to select
  public currentProd: Producto = new Producto; // product selected 
  public order: Order= new Order; // order to send
  nucleo: Nucleo = new Nucleo ;
  Afiliado : Afiliado = new Afiliado; // delegado del nucleo 

  constructor(private nucserv:NucleosService, private logsrv: LoginService, private datepipe: DatePipe ,private _prod: ProductoService,private _afil: AfiliadosService, private _export: ExceljsService, private datsrv: DatosService, private modalService: NgbModal) { }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    Swal.showLoading();
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    this.getListProd();
    this._afil.getNucAfiliado(this.elusu.afinro.toString().trim()).subscribe(
      resdele => {
        for (const dele of resdele) {
          if (dele.nucleo.delegado1 === this.elusu.afinro ||
            dele.nucleo.delegado2 === this.elusu.afinro) {
              this.nucleo = dele.nucleo;
              
              this.findDataDelegado(dele.nucleo.delegado1);
              this.refresh();
            break;
          }
        }
      }
    );



  }
  // agregar modo envia al campo fantasia
  addFantasia(nucleo: Nucleo) {
    Swal.fire({
      text: "El nucleo no posee informacion para modo de envio desea agregarla",
      input: 'text',
      showCancelButton:true,
      cancelButtonText: "Cancelar"
    }).then(res=>{
      if (res.value) {
        nucleo.fantasia = res.value;
        this.nucserv.saveNucleo(nucleo).subscribe(res=>{
          if (res) {
            Swal.fire("Exito","La informacion se modifico","success");
          }else{
            Swal.fire("Error","No se logro ejecutar la accion","error");
          }
        },err=>{
          console.log(err);
          Swal.fire("Error","Error al agregar modo de envio","error");
        })
      }
    })
  }
  
  findDataDelegado(delegado1: number) {
    this._afil.getAfiliado(delegado1.toString()).subscribe(res=>{
      if (res) {
        this.Afiliado = res;
      }
    });
  }
  //refresh data from DB by this.nucleo
  refresh() {
    this.getData().then(res => {
      if (res != null) {
        Swal.close();
        this.lista = res;
        if (this.nucleo != null) {
          if (this.nucleo.fantasia == null ||  this.nucleo.fantasia.length == 0) {
            this.addFantasia(this.nucleo);
          }
        }
      } else {
        Swal.fire("Atencion", "No se encontraron datos para mostrar", "info");
      }
    })

  }

  teFiltro(event, dt) {
    this.lista_fil = event.filteredValue;
  }

  //get list product 
  getListProd(){
    this._prod.getListProduct().subscribe(res => {
      if (res) {
        this.listProd = res;
      } else {
        this.listProd = [{id:0,descripcion: "Sin productos", notas:""}];
      }
    });
  }

  //get data from back 
  getData(): Promise<AfilProdDTO[]> {
    return new Promise((resolve, reject) => {
      this._afil.getListAfilProdDTO(this.nucleo.id).subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          reject(null);
        }
      }, err => {
        console.log(err);
        Swal.fire("Error", "No fue posible ejecutar la accion", "error");
      })
    });
  }

  //asign product 
  asignar(content: any,item: AfilProdDTO) {
    this.order= new Order;
    this.currentProd = new Producto;
    this.currentAfil = item;
    this.order.fechaAsig = this.datepipe.transform(Date.now(), 'yyyy-MM-dd'); 
    this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: false, centered: true }).result.then((result) => {
      
    }, (reason) => {
      console.log(this.order);
      this.addProductToAfil(this.currentAfil.cedula,this.order);
    });
  }

  //event list prod
  changeValueSelect(){
    this.order.producto = this.currentProd.descripcion;
  }

  //add prod to afil 
  addProductToAfil(cedula: string,order: Order){
    this._afil.addProductToAfil(cedula,order).subscribe(res=>{
      if (res) {
        this.refresh();
      }else{
        Swal.fire("Atencion", "La accion no se completo", "info");
      }
    },err=>{
      console.log(err);
      Swal.fire("Error", "Error al ejecutar la accion", "error");
    })
  }

  

  

  //delete product
  delete(cedula: string) {
    Swal.fire({
      titleText: "Estas seguro de ejecutar esta accion",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar"
    }).then(res => {
      if (res.value) {
        this._afil.clearAfilProd(cedula).subscribe(res => {
          if (res) {
            this.refresh();
          } else {
            Swal.fire("Atencion", "La accion no se completo", "info")
          }
        }, err => {
          console.log(err);
          Swal.fire("Error", "Error al ejecutar la accion", "error");
        })
      }
    })

  }

  //export to excel 
  export() {

  const promise: Promise<IReportAfilProd[]> = new Promise((resolve,reject)=>{
    this._afil.getReportAfilProd(this.lista).subscribe(res=>{
      if (res) {
        resolve(res);
      }else{
        reject(null);
      }
    })
   });

   if (promise) {
     promise.then(res=>{
       if (res != null) {
         this.buildExcel(res);
       }
     })
   }

  }
  buildExcel(arr: IReportAfilProd[]) {
    const lisXls = [];
    for (let i = 0; i < arr.length; i++) {
      let depart = "Sin definir";
      if (arr[i].ciudad != null) {
        if (arr[i].ciudad.dep!= null) {
          depart = arr[i].ciudad.dep.nombre;
        }
      }

      lisXls.push([
        arr[i].cedula,
        arr[i].nombresAfil + " " + arr[i].apellidos,
        arr[i].producto,
        arr[i].caracteristicas,
        arr[i].fechaAsig,
        arr[i].ciudad ? arr[i].ciudad.nombre : "Sin definir",
        depart,
      ]);
    }
    const pHeader = ["cedula", "Nombre y Apellido", "Producto", "Caracteristicas", "Fecha Asignacion", "Ciudad", "Departamento"];
    const pCol = [10, 30, 20, 20, 20, 20,20,20];
    const pTit = 'Informe Asignaciones Productos';
    const pSubtit = `Nucleo:${this.nucleo.nombre} , email: ${this.nucleo.email} , telf: ${this.nucleo.telefono} , Delegado/a: ${this.Afiliado.nombres} ${this.Afiliado.apellidos}`;
    this._export.generateExcelFix(
      pTit, pSubtit, this.objDato,
      pHeader, pCol, lisXls, [],
      [], [], [],
      {}
    );
  }


}
 
