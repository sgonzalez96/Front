import { Component, OnInit } from '@angular/core';
import { Invitacion } from '../../models/invitacion';
import { Usuario } from '../../../Admin/models/usuario';
import { LoginService } from '../../../Tools/serv/login.service';
import { EventosService } from '../../serv/eventos.service';
import { invitacionDto } from '../eve-manager/eve-manager.component';
import { formatDate } from '@angular/common';
import { Afiliado } from '../../../Afiliados/models/afiliado';
import { AfiliadosService } from '../../../Afiliados/serv/afiliados.service';
import { InvDTO } from '../../models/invdto';
import Swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-eve-usuario',
  templateUrl: './eve-usuario.component.html',
  styleUrls: ['./eve-usuario.component.css']
})
export class EveUsuarioComponent implements OnInit {

  lista: listaDTO[];
  elusu: Usuario;
  hoy: string;
  objAfil: Afiliado;
  swaltit = '';
  swalmsg = '';
  swaldos = '';
  activos = true;
  objInv: listaDTO;
  closeResult = '';
  notas = '';
  qualy = 3;

  constructor(
    private logsrv: LoginService,
    private afisrv: AfiliadosService,
    private modalService: NgbModal,
    private evesrv: EventosService
    ) { }


  ngOnInit() {
    this.hoy = formatDate(new Date(), 'yyyy-MM-dd',"en-US");

    console.log("arranca");
    console.log(this.hoy);
    this.lista = [];
    this.elusu = this.logsrv.getUsuarioFromStorage();
    this.afisrv.getAfiliado(this.elusu.afinro.toString().trim()).subscribe(
      elafi => {
        this.objAfil = elafi;
      }, error => {
        console.log(error);
      }
    );
    this.evesrv.getInvUsu(this.elusu.afinro.toString()).subscribe(
      resinv => {
        for (const eve of resinv){
          let unevedto: listaDTO = new listaDTO();
          unevedto.invdto = eve;
          const fdesde = formatDate(eve.evento.desde, 'yyyy-MM-dd',"en-US");
          const fhasta = formatDate(eve.evento.hasta, 'yyyy-MM-dd',"en-US");
          const fevento= formatDate(eve.evento.fecha, 'yyyy-MM-dd',"en-US");

          const yy = parseInt(fevento.substr(0,4),10);
          const mm = parseInt(fevento.substr(5,2),10) ; //al norestarle 1 le sumo 1 a prposito
          const dd = parseInt(fevento.substr(8,2),10);
          const farchivo = formatDate(new Date(yy , mm, dd), 'yyyy-MM-dd',"en-US");
          console.log(farchivo);
          unevedto.adv_exc = false;
          unevedto.adv_nov = false;
          unevedto.btn_pen = false;
          unevedto.btn_thu = false;
          unevedto.btn_han = false;
          unevedto.btn_tha = false;

          if (eve.evento.inscripcion) {
            if (fdesde <= this.hoy && fhasta >= this.hoy) {
              if (eve.status.trim() == 'Inscripta' || eve.inscripto) {
                unevedto.btn_thu = true;
                // estamos en ventana y ya eta inscripto solo puede bajarse
              } else if (eve.status.trim() == 'Rechazada') {
                unevedto.adv_exc = true;
                unevedto.btn_pen = true;
              } else {
                unevedto.adv_exc = true;
                unevedto.btn_pen = true;
                unevedto.btn_thu = true;
              }
            }
           } else {
             if (this.hoy < fevento) {
              unevedto.adv_nov = true;  //Novedad no precisa inscribir y no empezo
             }
           }

          unevedto.adv_sta = false;
          unevedto.btn_sta = false;

          if (eve.evento.evaluacion) {
            if (this.hoy >= fevento ) {
              unevedto.adv_sta = true;
              unevedto.btn_sta = true;

            }
          }

          if (eve.evento.asistencia) {
            if (this.hoy >= fevento ){
              if (eve.status.trim() != 'Falta') {
                unevedto.btn_tha = true;
              } else {
                unevedto.btn_tha = false;
                unevedto.btn_sta = false;
                unevedto.adv_sta = false;
              }
            }
          }

          unevedto.adv_pow = false;
          unevedto.btn_pow = false;
          if (this.hoy >= farchivo ) {
            if (eve.status.trim() != 'Falta' &&
                eve.status.trim() != 'Rechazada' )
          //     unevedto.adv_han = false;
          //     unevedto.btn_han = false;
          //     unevedto.btn_tha = false;

               unevedto.adv_pow = true;
               unevedto.btn_pow = true;
          }
          let estava = false;
          if (this.activos) {
            if (eve.status.trim() !== 'Falta' && eve.status.trim() !== 'Rechaza' && !unevedto.btn_pow)  {
              estava = true;
            }
          } else {
            if (eve.status.trim() === 'Falta' || eve.status.trim() === 'Rechaza' || unevedto.btn_pow)  {
              estava = true;
            }

          }

          if (estava) {
            this.lista.push(unevedto);
            console.log(this.lista);
          }
        }
      }
    );
  }

  //check invitacion con enlaces 
  sinUrl(){
    Swal.fire("Informacion","Este evento no contiene enlaces","info");
  }

  switch() {
    if (this.activos){
      this.activos =  false;
    } else {
      this.activos = true;
    }
    this.ngOnInit();
  }

  inscripcion(item) {
    console.log(item);
    const elitem: listaDTO = item;
    console.log(elitem);
    this.swaltit = '¿Confirma inscribirse a ' + elitem.invdto.evento.nombre + ' ?';
    this.swalmsg = 'Se llevará a cabo el ' + elitem.invdto.evento.fecha + ' a la hora '
    + elitem.invdto.evento.hora + ' en ' + elitem.invdto.evento.lugar;
    this.swaldos = 'Cancelar';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'success',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let invidto: InvDTO = new InvDTO();
        invidto.invitacion = elitem.invdto;
        invidto.invitacion.inscripto = true;
        invidto.invitacion.status = 'Inscripta';
        invidto.textolog = 'Invitacion confirmada por afiliada/o';
        invidto.usuId = this.elusu.idUser;
        this.evesrv.saveInvitacion(invidto).subscribe(
          resinv => {
            this.mimsg('¡Inscripción confirmada! ')
            this.ngOnInit();
          }
        );
      }
    });
  }

  rechazo(item) {
    const elitem: listaDTO = item;
    this.swaltit = '¿Declina participar de ' + elitem.invdto.evento.nombre + ' ?';
    this.swalmsg = 'Puede volver a registrarse durante el período de inscripciones';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Volver a eventos'
    }).then((result) => {
      if (result.value) {
        let invidto: InvDTO = new InvDTO();
        invidto.invitacion = elitem.invdto;
        invidto.invitacion.inscripto = false;
        invidto.invitacion.status = 'Rechazada';
        invidto.textolog = 'Invitacion rechazada por afiliada/o';
        invidto.usuId = this.elusu.idUser;
        this.evesrv.saveInvitacion(invidto).subscribe(
          resinv => {
            this.mimsg('¡Inscripción declinada! ');
            this.ngOnInit();
          }
        );
      }
    });
  }

  falta(item) {
    const elitem: listaDTO = item;
    this.swaltit = '¿Confirma su inasistencia a ' + elitem.invdto.evento.nombre + ' ?';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Volver a eventos'
    }).then((result) => {
      if (result.value) {
        let invidto: InvDTO = new InvDTO();
        invidto.invitacion = elitem.invdto;
        invidto.invitacion.inscripto = false;
        invidto.invitacion.status = 'Falta';
        invidto.textolog = 'Inasistencia confirmada por afiliada/o';
        invidto.usuId = this.elusu.idUser;
        this.evesrv.saveInvitacion(invidto).subscribe(
          resinv => {
            this.mimsg('¡Inasistencia confirmada! ');
            this.ngOnInit();
          }
        );
      }
    });
  }


  mimsg(tete){
    this.swaltit = tete;
    this.swalmsg = '';
    Swal.fire({
      title: this.swaltit,
      text: this.swalmsg,
      type: 'success',
      confirmButtonText: 'OK',
    });
    return;
  }


  // --------------- Formulario de evaluacion
  evaluar(content, lainvi) {
    this.objInv = lainvi;
    this.notas = this.objInv.invdto.evalnota;
    this.qualy = this.objInv.invdto.rating;

    this.modalService.open(content,{backdrop: 'static',size: 'lg', keyboard: false, centered: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  closeEval() {
    this.modalService.dismissAll();
  }

  evaluo(f:NgForm) {

    let invidto: InvDTO = new InvDTO();
    invidto.invitacion = this.objInv.invdto;
    invidto.invitacion.evalnota = this.notas;
    invidto.invitacion.rating = this.qualy;
    invidto.textolog = 'Evaluación enviada ';
    invidto.usuId = this.elusu.idUser;
    this.evesrv.saveInvitacion(invidto).subscribe(
      resinv => {
        this.mimsg('¡Evaluación actualizada! ');
        this.closeEval();
        this.ngOnInit();
      }
    );
  }


}

export class listaDTO {
  invdto: Invitacion;

  adv_exc = false;
  adv_nov = false;
  adv_sta = false;
  adv_han = false;
  adv_pow = false;

  btn_pen = false;
  btn_thu = false;
  btn_han = false;
  btn_tha = false;
  btn_pow = false;
  btn_sta = false;


}
