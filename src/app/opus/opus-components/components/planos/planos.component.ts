import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng-lts';
import Swal from 'sweetalert2';
import { Deposito } from '../../models/deposito';
import { DepositoRoot } from '../../models/deposito-root';
import { Locacion } from '../../models/locacionDep';
import { Plano } from '../../models/plano';
import { PuntoPlano } from '../../models/punto-plano';
import { StorageCds } from '../../models/storage-cds';
import { MatricerosService } from '../../services/matriceros.service';
import { AsignPointComponent } from '../asign-point/asign-point.component';
import { AsignoLocacionesComponent } from '../asigno-locaciones/asigno-locaciones.component';
import { CreoPlanoComponent } from '../creo-plano/creo-plano.component';


@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss']
})
export class PlanosComponent implements OnInit {

  // Depositos
  storageList: StorageCds[] = [];
  selectedStorage!: StorageCds;
  ultimoSelectedStorage!: StorageCds;
  // Planos
  planosList!: Plano[];
  planoSeleccionado: Plano | null = null;
  ultimoPlanoSeleccionado: Plano | null = null;
  indicePlanoSeleccionado = 0;
  // Puntos
  puntosList: PuntoPlano[] = [];
  puntoSeleccionado: PuntoPlano | null = null ;
  ultimoPuntoSeleccionado: PuntoPlano | null = null ;
  // Locaciones
  locacionesList: Locacion[] = [];
  haylocaciones = false;

  constructor(private matser: MatricerosService, public dialogService: DialogService) { }

  ngOnInit() {
    this.matser.getActiveStorages().subscribe(
      resu => {
        console.log('depositos');
        console.log(resu);
        this.storageList = resu;
        this.selectedStorage = this.storageList[0];
        this.ultimoSelectedStorage = this.storageList[0];
        this.initData(0);
      }, error => {
        Swal.fire({
          title: 'Error al intentar cargar los depósitos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  initData(indice: number) {
    console.log('en initdata con indice = ' + indice);
    this.planosList = [];
    this.puntosList = [];
    this.locacionesList = [];
    this.planoSeleccionado = null;
    this.puntoSeleccionado = null;
    this.selectedStorage = this.ultimoSelectedStorage;
    this.haylocaciones = false;

    this.matser.getStorageInfo(this.selectedStorage.erpCode, 'L').subscribe(
      resu => {
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar cargar los planos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.planosList = [];
          this.puntosList = [];
          this.locacionesList = [];
          this.planoSeleccionado = null;
          this.puntoSeleccionado = null;
          this.ultimoPlanoSeleccionado = null;
          this.ultimoPuntoSeleccionado = null;
        } else {
          if (resu.object.deposito.planos != null && resu.object.deposito.planos != undefined) {
            this.planosList = resu.object.deposito.planos;
            if (this.planosList.length > 0) {
              if (indice == -1) {
                this.planoSeleccionado = this.planosList[this.planosList.length - 1];
                this.ultimoPlanoSeleccionado = this.planosList[this.planosList.length - 1];
              } else {
                this.planoSeleccionado = this.planosList[indice];
                this.ultimoPlanoSeleccionado = this.planosList[indice];
              }
            }
            this.seleccionoPlano(null);
          }
        }
      }, error => {
        Swal.fire({
          title: 'Error al intentar cargar los planos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.planosList = [];
        this.puntosList = [];
        this.locacionesList = [];
        this.planoSeleccionado = null;
        this.puntoSeleccionado = null;
        this.ultimoPlanoSeleccionado = null;
        this.ultimoPuntoSeleccionado = null;
      }
    );
  }

  changeStorage(evento: any) {
    this.selectedStorage = evento.value;
    this.ultimoSelectedStorage = evento.value;
    console.log(this.selectedStorage);
    this.indicePlanoSeleccionado = 0;
    this.initData(0);
  }

  muevoPlano(pp: Plano, modo: string, indice: number) {
    const largo = this.planosList.length;
    console.log(largo + '//' + indice);

    if (modo == 'B') {
      if (indice != (largo - 1)) {
        let ord = 1;
        for (let i = 0; i < this.planosList.length; i++) {
          if (i==indice) {
            this.planosList[i].planoOrd = ord + 1;
          } else if (i==(indice + 1)) {
            this.planosList[i].planoOrd = ord;
            ord = ord + 2;
          } else {
            this.planosList[i].planoOrd = ord;
            ord++;
          }
        }
        // this.planosList[indice].planoOrd = this.planosList[indice].planoOrd + 1;
        // this.planosList[indice + 1].planoOrd = this.planosList[indice + 1].planoOrd - 1;
        this.cambioOrden(indice + 1);
      }
    } else {
      if (indice != 0) {
        let ord = 1;
        for (let i = 0; i < this.planosList.length; i++) {
          if (i==indice) {
            this.planosList[i].planoOrd = ord;
            ord = ord + 2;
          } else if (i==(indice - 1)) {
            this.planosList[i].planoOrd = ord + 1;
          } else {
            this.planosList[i].planoOrd = ord;
            ord++;
          }
        }
        // this.planosList[indice].planoOrd = this.planosList[indice].planoOrd - 1;
        // this.planosList[indice - 1].planoOrd = this.planosList[indice - 1].planoOrd + 1;
        this.cambioOrden(indice - 1);
      }
    }
  }

  cambioOrden(indice: number) {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.selectedStorage.erpCode;
    let arrplanos: Plano[] = [];
    for (const pp of this.planosList) {
      let elplano = new Plano();
      elplano.planoId = pp.planoId;
      elplano.planoDsc = pp.planoDsc;
      elplano.planoOrd = pp.planoOrd;
      arrplanos.push(elplano);
    }

    eldep.planos = arrplanos;
    miroot.deposito = eldep;

    this.matser.setPlano(miroot).subscribe(
      resu => {
        console.log('Resultado de mover');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar mover el plano',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.initData(indice);
        }
      }, error => {
        Swal.fire({
          title: 'Error al intentar mover el plano',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  eliminoPlano(pp: Plano) {
    Swal.fire({
      title: 'Seguro desea eliminar el plano?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teEliminoPlano(pp);
      } else {
        console.log('cancele');
      }
    });
  }

  teEliminoPlano(pp: Plano) {
    this.matser.deletePlano(this.selectedStorage.erpCode, pp.planoId).subscribe(
      resu => {
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar eliminar el plano',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } else {
          Swal.fire({
            title: 'Plano eliminado con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.initData(0);
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar eliminar el plano',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  editoPlano(pp: Plano, indice: number) {
    console.log('edito');
    const ref = this.dialogService.open(CreoPlanoComponent, {
      data: {
          planos: this.planosList,
          depo: this.selectedStorage,
          modo: 'M',
          planoId: pp
      },
      header: 'Modificación de plano ' + pp.planoId,
      width: '60%',
      baseZIndex: 10000
    });

    ref.onClose.subscribe((devol: string) => {
      console.log(devol);
      if (devol == 'OK') {
        Swal.fire({
          title: 'Plano modificado con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.initData(indice);
      } else if (devol == 'MAL') {
        Swal.fire({
          title: 'Error al intentar modificar el plano',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    });
  }

  creoPlano() {
    console.log('creo');
    const ref = this.dialogService.open(CreoPlanoComponent, {
      data: {
          planos: this.planosList,
          depo: this.selectedStorage,
          modo: 'C',
          planoId:null
      },
      header: 'Creación de plano para el depósito ' + this.selectedStorage.storageDsc,
      width: '60%',
      baseZIndex: 10000
    });

    ref.onClose.subscribe((devol: string) => {
      console.log(devol);
      if (devol == 'OK') {
        Swal.fire({
          title: 'Plano creado con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.initData(-1);
      } else if (devol == 'MAL') {
        Swal.fire({
          title: 'Error al intentar crear el plano',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    });
  }

  seleccionoPlano(ev: any) {
    console.log(ev);
    console.log('selecciono');
    console.log(this.planoSeleccionado);
    this.puntosList = this.planoSeleccionado ? this.planoSeleccionado.puntos: [];
    console.log(this.puntosList);
    if (this.puntosList != null && this.puntosList != undefined && this.puntosList.length > 0) {
      this.puntoSeleccionado = this.puntosList[0];
      if (this.puntoSeleccionado.locaciones != null && this.puntoSeleccionado.locaciones != undefined && this.puntoSeleccionado.locaciones.length > 0) {
        this.haylocaciones = true;
      } else {
        this.haylocaciones = false;
      }
      this.ultimoPuntoSeleccionado = this.puntosList[0];
      if (ev != null && ev.index != null) {
        this.indicePlanoSeleccionado = ev.index;
      }
      this.seleccionoPunto(null);
    } else {
      this.puntoSeleccionado = null;
      this.ultimoPuntoSeleccionado = null;
      this.indicePlanoSeleccionado = 0;
      this.haylocaciones = false;
    }
    console.log(this.puntoSeleccionado);
  }

  seleccionoPunto(ev: any) {
    console.log('en selecciono punto');
    console.log(this.puntoSeleccionado);
    if (this.puntoSeleccionado != null) {
      this.locacionesList = this.puntoSeleccionado.locaciones;
    if (this.puntoSeleccionado.locaciones != null && this.puntoSeleccionado.locaciones != undefined && this.puntoSeleccionado.locaciones.length > 0) {
      this.haylocaciones = true;
    } else {
      this.haylocaciones = false;
    }
    }
    
    console.log('haylocaciones = ' + this.haylocaciones);
    console.log(this.locacionesList);
  }

  eliminoPunto(pp: PuntoPlano) {
    Swal.fire({
      title: 'Seguro desea eliminar el punto del plano?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teEliminoPunto(pp);
      } else {
        console.log('cancele');
      }
    });
  }

  teEliminoPunto(pte: PuntoPlano) {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.selectedStorage.erpCode;
    let arrplanos: Plano[] = [];
    let elplano = new Plano();
    elplano.planoId = this.planoSeleccionado ?  this.planoSeleccionado.planoId : 0;
    const lospuntos: PuntoPlano[] = [];
    let pp = new PuntoPlano();
    pp.puntoId = pte.puntoId;
    lospuntos.push(pp);
    elplano.puntos = lospuntos;
    arrplanos.push(elplano);
    eldep.planos = arrplanos;
    miroot.deposito = eldep;

    this.matser.eliminoPuntoDePlano(miroot).subscribe(
      resu => {
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar eliminar el punto',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
        } else {
          Swal.fire({
            title: 'Punto eliminado con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
          this.initData(this.indicePlanoSeleccionado);
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar eliminar el punto',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    );
  }

  editoPunto(pp: PuntoPlano) {
    const ref = this.dialogService.open(AsignPointComponent, {
      data: {
          depo: this.selectedStorage,
          modo: 'M',
          plano: this.planoSeleccionado,
          punto: pp
      },
      header: 'Asignación de punto al plano "' + this.planoSeleccionado?.planoDsc + '"',
      width: '60%',
      baseZIndex: 10000,
      contentStyle: {"height": "400px", "overflow": "auto"},
    });

    ref.onClose.subscribe((devol: string) => {
      console.log(devol);
      if (devol == 'OK') {
        Swal.fire({
          title: 'Punto asignado con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.initData(this.indicePlanoSeleccionado);
      } else if (devol == 'MAL') {
        Swal.fire({
          title: 'Error al intentar asignar el punto',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    });
  }

  creoPunto() {
    const ref = this.dialogService.open(AsignPointComponent, {
      data: {
          depo: this.selectedStorage,
          modo: 'C',
          plano: this.planoSeleccionado,
          punto: null
      },
      header: 'Asignación de punto al plano "' + this.planoSeleccionado?.planoDsc + '"',
      width: '60%',
      baseZIndex: 10000,
      contentStyle: {"height": "400px", "overflow": "auto"},
    });

    ref.onClose.subscribe((devol: string) => {
      console.log(devol);
      if (devol == 'OK') {
        Swal.fire({
          title: 'Punto asignado con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.initData(this.indicePlanoSeleccionado);
      } else if (devol == 'MAL') {
        Swal.fire({
          title: 'Error al intentar asignar el punto',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    });
  }

  eliminoLocacion(ll: Locacion) {
    console.log('elimino');
    console.log(ll);
    Swal.fire({
      title: 'Seguro desea eliminar la locación del punto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        this.teEliminoLoca(ll);
      } else {
        console.log('cancele');
      }
    });
  }

  teEliminoLoca(ll: Locacion) {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.selectedStorage.erpCode;
    let arrplanos: Plano[] = [];
    let elplano = new Plano();
    elplano.planoId = this.planoSeleccionado ? this.planoSeleccionado.planoId: 0;
    const lospuntos: PuntoPlano[] = [];
    let pp = new PuntoPlano();
    pp.puntoId = this.puntoSeleccionado ? this.puntoSeleccionado.puntoId: 0;
    const locas: Locacion[] = [];
    locas.push(ll);
    pp.locaciones = locas;
    lospuntos.push(pp);
    elplano.puntos = lospuntos;
    arrplanos.push(elplano);
    eldep.planos = arrplanos;
    miroot.deposito = eldep;
    console.log('a borrar la locacion');
    console.log(miroot);

    this.matser.eliminoLocacionesAPunto(miroot).subscribe(
      resu => {
        console.log('el resu');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar eliminar la locación',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
        } else {
          Swal.fire({
            title: 'Locación eliminado con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
          this.initData(this.indicePlanoSeleccionado);
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar eliminar la locación',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    );
  }

  eliminoLocaciones() {
    if (this.puntoSeleccionado != null) {
      if (this.puntoSeleccionado.locaciones != null && this.puntoSeleccionado.locaciones != undefined && this.puntoSeleccionado.locaciones.length > 0) {
        Swal.fire({
          title: 'Seguro desea eliminar todas las locaciones del punto?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          console.log(result)
          if (result.value && this.puntoSeleccionado) {
            this.teEliminoLocaciones(this.puntoSeleccionado.locaciones);
          } else {
            console.log('cancele');
          }
        });
      }
      
    }
  }

  teEliminoLocaciones(locas: Locacion[]) {
    let miroot = new DepositoRoot();
    let eldep = new Deposito();
    eldep.depId = this.selectedStorage.erpCode;
    let arrplanos: Plano[] = [];
    let elplano = new Plano();
    elplano.planoId = this.planoSeleccionado ? this.planoSeleccionado.planoId: 0;
    const lospuntos: PuntoPlano[] = [];
    let pp = new PuntoPlano();
    pp.puntoId = this.puntoSeleccionado ? this.puntoSeleccionado.puntoId : 0;
    pp.locaciones = locas;
    lospuntos.push(pp);
    elplano.puntos = lospuntos;
    arrplanos.push(elplano);
    eldep.planos = arrplanos;
    miroot.deposito = eldep;

    this.matser.eliminoLocacionesAPunto(miroot).subscribe(
      resu => {
        console.log('el resu');
        console.log(resu);
        if (resu.error) {
          Swal.fire({
            title: 'Error al intentar eliminar las locaciones',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
        } else {
          Swal.fire({
            title: 'Locaciones eliminados con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {container: 'z-index: 100000;'}
          });
          this.initData(this.indicePlanoSeleccionado);
        }
      }, error => {
        console.log(error);
        Swal.fire({
          title: 'Error al intentar eliminar las locaciones',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    );
  }

  asignoLocaciones() {
    const ref = this.dialogService.open(AsignoLocacionesComponent, {
      data: {
          depo: this.selectedStorage,
          plano: this.planoSeleccionado,
          punto: this.puntoSeleccionado
      },
      header: 'Asignación de locaciones al punto "' + this.puntoSeleccionado?.puntoDsc + '"',
      width: '70%',
      baseZIndex: 10000,
      contentStyle: {"height": "70vh", "overflow": "auto"},
    });

    ref.onClose.subscribe((devol: string) => {
      console.log(devol);
      if (devol == 'OK') {
        Swal.fire({
          title: 'Locaciones asignadas con exito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.initData(this.indicePlanoSeleccionado);
      } else if (devol == 'MAL') {
        Swal.fire({
          title: 'Error al intentar asignar las locaciones',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      } else if (devol == 'NOLOCA') {
        Swal.fire({
          title: 'Error al intentar cargar las locaciones',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      } else if (devol == '0ESTANTERIAS') {
        Swal.fire({
          title: 'No hay tipos de estantería cargados',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      } else if (devol == 'NOESTANTERIAS') {
        Swal.fire({
          title: 'Error al cargar los tipos de estantería',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {container: 'z-index: 100000;'}
        });
      }
    });
  }
}
