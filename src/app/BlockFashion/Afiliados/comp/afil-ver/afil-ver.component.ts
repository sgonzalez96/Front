import { Component, OnInit, OnDestroy, ViewChild, Inject, LOCALE_ID, Input, Output, EventEmitter } from '@angular/core';
import { AngularMyDatePickerDirective } from 'angular-mydatepicker';
import pageSettings from '../../../../config/page-settings';
import { Afiliado } from '../../models/afiliado';
import { Cargo } from '../../../Admin/models/cargo';
import { Ciudad } from '../../../Admin/models/ciudad';
import { Localidad } from '../../../Admin/models/localidad';
import { AfilNucleo } from '../../models/afilnuc';
import { Nucleo } from '../../models/nucleo';
import { AfilDto } from '../../models/afildto';
import { Usuario } from '../../../Admin/models/usuario';
import { Dato } from '../../../Admin/models/dato';
import { Log } from '../../../Admin/models/log';
import { AfilNota } from '../../models/afilnota';
import { NucleosService } from '../../serv/nucleos.service';
import { ActivatedRoute } from '@angular/router';
import { AfiliadosService } from '../../serv/afiliados.service';
import { CargoService } from '../../../Admin/services/cargo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExceljsService } from '../../../Tools/serv/exceljs.service';
import { DatosService } from '../../../Admin/services/datos.service';
import { LoginService } from '../../../Tools/serv/login.service';
import { UsuarioService } from '../../../Admin/services/usuario.service';
import { CiudadService } from '../../../Admin/services/ciudad.service';
import { Location, formatDate } from '@angular/common';

@Component({
  selector: 'app-afil-ver',
  templateUrl: './afil-ver.component.html',
  styleUrls: ['./afil-ver.component.css']
})
export class AfilVerComponent implements OnInit, OnDestroy {
  @Input() objAfil: Afiliado; 
  @Output() ciudadChange = new EventEmitter();
  @Output() winChange = new EventEmitter();
  @Output() winClose = new EventEmitter();

  @ViewChild('dp', null) mydp: AngularMyDatePickerDirective;
  
  pageSettings = pageSettings;
  idAfil = '';
  swaltit: string;
  swalmsg: string;
  lopido = false;
  varsCargo: Cargo[];
  elCargo: Cargo;
  varsCiud: Ciudad[];
  laCiud: Ciudad;
  varsLoc: Localidad[];
  laLoca: Localidad;
  forma = ['a) Jefa de hogar', 'b) Niños a cargo', 'c) Adultos mayores a cargo', 'd) discapacitados a cargo', 'e) Otros']
  laforma = 4;
  status = ['Iniciada', 'Sol.Reingreso', 'Aprobada', 'Condicional', 'Terminada', 'Rechazada' , 'P.Revision'];
  elstat = 0;
  tipo = ['Afiliada/o', 'Fundador/a', 'Otro/a' ]
  eltipo = 0;
  fechaprueba = new Date();
  listanuc: AfilNucleo[];
  nucleos: Nucleo[];
  closeResult = '';
  objFinal = new AfilDto();
  nivel = 0 ;
  elusu: Usuario = new Usuario();

  elstatus = '';
  objCiudad: Ciudad;
  objLoc: Localidad;
  objDato: Dato;
  listalog: Log[];
  notas: AfilNota[];

  foto: File = null;
  previewUrl: any = null;

  constructor(private nucsrv: NucleosService,
              private actRout: ActivatedRoute,
              private afisrv: AfiliadosService,
              private ciusrv: CiudadService,
              private carsrv: CargoService,
              private modalService: NgbModal,
              private excsrv: ExceljsService,
              private datsrv: DatosService,
              private logsrv: LoginService,
              private perfsrv: UsuarioService,
              @Inject(LOCALE_ID) private locale: string,
              private _location: Location) {
   }

  ngOnDestroy() {
    this.pageSettings.pageWithFooter = false;
  }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.nivel = this.elusu.getNivel();

    this.varsCiud = [];
    this.varsLoc = [];
    this.varsCargo = [];
    this.nucleos = [];
    this.listanuc = [];
    this.datsrv.getDato('1').subscribe(
      resdat => {
        this.objDato = resdat;
      }
    );
    
        this.ciusrv.getCiudades().subscribe(
          resci => {
            this.varsCiud = resci;
            this.idAfil = this.actRout.snapshot.params['id'];
      
      
            this.nucsrv.getNucleos().subscribe(
              resnuc => {
                if (resnuc !== undefined) {
                  this.nucleos = resnuc;
                }
                this.getAfiliado();
              }
            );


          }
        );

  }

  getAfiliado() {


          if (this.objCiudad == null || this.objCiudad === undefined) {
            this.laCiud = this.varsCiud[0];
          } else {
            this.laCiud = this.objAfil.ciudad;
          }
          const mifecha = formatDate(this.objAfil.fecnac, 'yyyy-MM-dd', this.locale);
          this.fechaprueba = new Date(
            parseInt(mifecha.substr(0, 4), 10),
            parseInt(mifecha.substr(5, 2), 10) - 1,
            parseInt(mifecha.substr(8, 2), 10));
          this.objAfil.notas = '';
          this.cargoNucleos();
          this.previewUrl = 'data:image/png;base64,' + this.objAfil.fichaimg;
          // this.afisrv.getNotas("A", this.idAfil.toString(), this.nivel.toString()).subscribe(
          //   resnot => {
          //     this.notas = resnot;
          //   }
          // );
  }

  cargoNucleos() {
    this.afisrv.getNucAfiliado(this.objAfil.cedula).subscribe(
      resanu => {
        if (resanu !== undefined) {
          this.listanuc = resanu;
          for (let i = 0; i < this.listanuc.length; i++) {
            if (this.listanuc[i].nucleo.delegado1 === parseInt(this.objAfil.cedula, 10) ){
              this.listanuc[i].del1 = true;
            }
            if (this.listanuc[i].nucleo.delegado2 === parseInt(this.objAfil.cedula, 10) ){
              this.listanuc[i].del2 = true;
            }
          }
        }
      }
    );
  }

  onChangeFecnac(modelito) {
    //  this.mdel1 = modelito;
    //  this.objAfil.fecnac = this.model1.singleDate.jsDate;
    //  this.fecnac = formatDate(this.objAfil.fecnac, "yyyy-MM-dd","en-US");
  }
  
  // onChangeFecinipago(modelito) {
  //   this.model2 = modelito;
  //   this.objNucleo.fecinipago = this.model2.singleDate.jsDate;
  //   this.fecinipago = formatDate(this.objNucleo.fecinipago, "yyyy-MM-dd","en-US");
  // }


  volver() {
    this.winChange.emit('');
  }

  d(conc){
    this.winClose.emit('');
  }

  get today() {
    return new Date();
  }

}
