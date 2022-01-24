import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Ciudad } from '../../models/ciudad';
import { CiudadService } from '../../services/ciudad.service';
import { Costo } from '../../models/costo';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',
  styleUrls: ['./costos.component.css']
})
export class CostosComponent implements OnInit {
  @Input() objCiud: Ciudad;
  @Output() ciudadChange = new EventEmitter();
  @Output() winChange = new EventEmitter();
  @Output() winClose = new EventEmitter();

  @ViewChild('elvalor', null) valorElement: ElementRef;
  
  lista: costoDTO[];
  ciudades: Ciudad[];
  costos: Costo[];
  activo = false;
  undto: costoDTO;
  indi = 0;
  valor = 0;

  constructor(private ciudsrv: CiudadService ) { }

  ngOnInit() {
    this.ciudades = [];
    this.lista = [];
    this.ciudsrv.getCostos(this.objCiud.id.toString()).subscribe(
      rescos => {
        this.costos = rescos;
        this.ciudsrv.getCiudades().subscribe(
          resciud => {
            this.ciudades = resciud;
            for (const city of this.ciudades){
              let midto: costoDTO = new costoDTO();
              midto.ciudad = city;
              for (const elcosto of this.costos){
        
                if (elcosto.ciudori.id === city.id || elcosto.ciuddst.id === city.id){
        
                  midto.costo = elcosto;
                  break;
                }
              }
              if (midto.costo == null){
                let elcosto = new Costo();
                elcosto.ciudori = this.objCiud;
                elcosto.ciuddst = city;
                elcosto.valor = 0;
                elcosto.fecult = new Date();
                midto.costo = elcosto;
              }
              this.lista.push(midto);
            }
          }
        );
      }
    );
  }

  d(conc){
    this.winClose.emit('');
  }

  activo_cos(indi){
    this.indi = indi;
    this.activo = true;
    this.undto = this.lista[this.indi];
    this.valor = this.undto.costo.valor;
    //this.valorElement.nativeElement.focused();
    //this.valorElement.nativeElement.focus();
  }

  agrego_costo(f: NgForm){
    this.undto.costo.fecult = new Date();
    this.undto.costo.valor = this.valor;
    this.ciudsrv.saveCosto(this.undto.costo).subscribe(
      rescos=>{
        this.undto.costo= rescos;
        this.lista[this.indi] = this.undto;
        this.activo = false;
      }
    );
  }

  cierro_costo(){
    this.activo = false;
  }
}

export class costoDTO{
  ciudad: Ciudad;
  costo: Costo;
}