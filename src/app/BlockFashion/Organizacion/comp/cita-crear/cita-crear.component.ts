import { Component, OnInit } from '@angular/core';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import Swal from 'sweetalert2';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { Cita } from '../../models/citalegal';
import { Nucleo } from '../../../Afiliados/models/nucleo';
import { AfilNucleo } from '../../../Afiliados/models/afilnuc';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { citaDTO } from '../../models/citadto';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { CitasService } from '../../serv/citas.service';
import { Abogado } from '../../models/abogado';
import { AbogadosService } from '../../serv/abogados.service';

@Component({
  selector: 'app-cita-crear',
  templateUrl: './cita-crear.component.html',
  styleUrls: ['./cita-crear.component.css']
})
export class CitaCrearComponent implements OnInit {
  idAfil = '';
  objAfil = new Afiliado();
  swaltit = '';
  swalmsg = '';
  swaldos = '';

  objCita = new Cita();
  objNucleo: Nucleo = new Nucleo();
  listaNuc: AfilNucleo[];
  objCitaDTO = new citaDTO();
  elusu: Usuario ;
  listAbogados: Abogado[]= []
  preferAbogado:string = "Sin preferencia";

  constructor(
    private afisrv: AfiliadosService,
    private _location: Location,
    private logsrv: LoginService,
    private citasrv: CitasService,
    private abosrv: AbogadosService
  ) { }

  ngOnInit() {
    this.elusu = this.logsrv.getUsuarioFromStorage();

    //buscar abogado
    this.listAbogados=[];
    this.abosrv.getAbogados().subscribe(
      res => {
        console.log(res);
        res.forEach(element => {
          if (element.activo && element.horario != null && element.dias != null) {
            
            this.listAbogados.push(element)
          }
        });
        
      }
    );
  }

  cambioId(mellega) {
    this.idAfil = mellega;
      //@todo valido que sean numeros
      if (this.idAfil === undefined ||
        this.idAfil === null ||
        this.idAfil.trim() ==='' ) {
        this.swaltit = 'Atención';
        this.swalmsg = 'La cédula no puede ser vacía';
        Swal.fire({
            title: this.swaltit,
            text: this.swalmsg,
            type: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }
      this.afisrv.getAfiliado(this.idAfil.trim()).subscribe(
        resafi => {
          if (resafi !=null && resafi != undefined) {
            this.objAfil = resafi;
            this.afisrv.getNucAfiliado(this.objAfil.cedula.trim()).subscribe(
              lisnuc => {
                if (lisnuc == null || lisnuc === undefined) {
                  Swal.fire({
                    title: 'Consulte el estado de la ficha. No hay nucleos asociacdos ',
                    text: '',
                    type: 'warning',
                    confirmButtonText: 'OK',
                  });
                }
                this.listaNuc = lisnuc;
                this.objNucleo = this.listaNuc[0].nucleo;
                for (const nunu of this.listaNuc) {
                  if (nunu.cotizante) {
                    this.objNucleo = nunu.nucleo;
                    break;
                  }
                }
    
              }
            );

          } else  {
            this.swaltit = 'Atención';
            this.swalmsg = 'Cédula inexistente en el padrón';
            Swal.fire({
                title: this.swaltit,
                text: this.swalmsg,
                type: 'warning',
              confirmButtonText: 'OK',
            });
          }

        }, error => {
          this.swaltit = 'Atención';
          this.swalmsg = 'Error al leer la cédula';
          Swal.fire({
              title: this.swaltit,
              text: this.swalmsg,
              type: 'warning',
            confirmButtonText: 'OK',
          });
        }
      );
  }

  creoCita(f: NgForm){
    if (this.objNucleo == null ) {
      Swal.fire({
        title: 'No hay nucleo asociado al afiliado',
        text: '',
        type: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (this.objCita.motivo.trim() === '' || this.objCita.prefiere.trim() ==='') {
      Swal.fire({
        title: 'Debe ingresar motivo y preferencia',
        text: '',
        type: 'warning',
        confirmButtonText: 'OK',
      });
    } else {
      this.objCitaDTO.textolog = 'Solicitud de cita legal por Sintep';
      this.objCitaDTO.usuId = this.elusu.idUser;
      
      this.objCita.afiliado = this.objAfil;
      this.objCita.nucleo = this.objNucleo;
      this.objCita.fecsol = new Date();
      this.objCita.status = 'Solicitada';
      this.objCita.asistio = false;
      this.objCita.abogPrefiere = this.preferAbogado;
      this.objCitaDTO.cita = this.objCita;
      
      this.citasrv.saveCita(this.objCitaDTO).subscribe(
        resok => {
          Swal.fire({
            title: 'Consulta ingresada número ' + resok.id,
            text: '',
            type: 'success',
            confirmButtonText: 'OK',
          });
          this.ngOnInit();
        }
      );
    }
  }

  volver() {
    this._location.back();
  }
}
