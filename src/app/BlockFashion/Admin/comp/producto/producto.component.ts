import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from './../../models/producto';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import pageSettings from '../../../../config/page-settings';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  public lista: Producto[] = [];
  pageSettings = pageSettings;
  public currentProduct = new Producto;
  public titlePopup: string = "";


  constructor(private _prod: ProductoService, private modalService: NgbModal) {
    this.pageSettings.pageWithFooter = true;
  }

  ngOnInit() {
    Swal.showLoading();
    //check promise 
    this.refresh();
  }
  refresh() {
    this.getListData().then(res => {
      Swal.close();
      if (res != null) {
        this.lista = res;
      }
    }).catch(() => {
      Swal.fire("Error", "Error al obtener los datos", "error");
    });
  }
  //get list product
  getListData(): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      this._prod.getListProduct().subscribe(res => {
        if (res) {
          resolve(res);
        } else {
          reject(null);
        }
      });
    })

  }

  //create product
  popup(content, item: Producto) {
    let titleRespose = "";
    if (item != null) {
      this.titlePopup = "Editar producto";
      this.currentProduct = item;
      titleRespose = "Producto editado";
    } else {
      this.currentProduct = { id: 0, descripcion: "", notas: "" };
      this.titlePopup = "Crear producto";
      titleRespose = "Producto creado";
    }

    this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: false, centered: true }).result.then((result) => {

    }, (reason) => {
      console.log(this.currentProduct);

      this.save(this.currentProduct, titleRespose);
    });
  }

  save(data: Producto, title: string) {
    this._prod.saveProduct(data).subscribe(res => {
      if (res != null) {
        
        Swal.fire("Exito", title, "success").then(()=>{
          this.refresh();
        });
      } else {
        Swal.fire("Exito", "La accion no se completo ", "success");
      }
    }, err => {
      console.log(err);
      Swal.fire("Exito", "Error al ejecutar la accion ", "success");
    })
  }

  //delete product by id 
  deleteProduct(id: number) {
    Swal.fire({
      titleText: "Esta seguro de ejecutar esta accion",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
    }).then((res) => {
      if (res.value) {
        this._prod.deleteProduct(id).subscribe(res => {
          if (res) {
            
            Swal.fire("Exito", "El producto fue eliminado", "success").then(()=>{
              this.refresh();
            });
          } else {
            Swal.fire("Exito", "El producto no existe", "success");
          }
        }, err => {
          console.log(err);
          Swal.fire("Error", "Error al ejecutar la accion", "error")
        });
      }
    })


  }





}
