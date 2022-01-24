import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UtilesService } from '../../../commons/utiles.service';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  //data form
  public formDataProfile: FormGroup;
  public formPass: FormGroup;
  public esEdit: boolean = false

  //pageSettings = pageSettings;
  user = new Usuario();
  foto: File | undefined;
  previewUrl: any = null;
  cacheUrl: any = null;
  public title: string | null;
  public statusPass: boolean=false;

 

  constructor( private modalService: NgbModal,private logsrv: LoginService, private admsrv: UsersService, private utiser: UtilesService, private _formBuilder: FormBuilder) {
    //this.pageSettings.pageWithFooter = true;
    this.title = "";
    this.user = this.admsrv.getUserFromStorage();
    this.formDataProfile = this._formBuilder.group({
      file: [],
      fullname: [''],
      username: [''],
      email: [''],
      address: [''],
      phone: [''],

    });
    this.formPass = this._formBuilder.group({
      pass: ['', Validators.required],
      conf: ['', Validators.required],
    })
  }

  public get f() {
    return this.formDataProfile.controls
  }


  //build profile 
  buildProfile() {
    this.f.fullname.setValue(this.user.nombreCompleto || " ");
    this.f.username.setValue(this.user.userName || " ");
    this.f.email.setValue(this.user.email || " ");
    this.f.address.setValue(this.user.direccion || " ");
    this.f.phone.setValue(this.user.telefono || " ");
    

  }


  saveChangeData() {

    this.user.nombreCompleto = this.f.fullname.value;
    this.user.email = this.f.email.value;
    this.user.direccion = this.f.address.value;
    this.user.telefono = this.f.phone.value;
  }


  ngOnInit() {

    console.log(this.user);
    this.title = "Perfil de   " + this.user.nombreCompleto || " ";
    this.previewUrl = 'data:image/png;base64,' + this.user.foto;
    this.buildProfile();
  }

  //enabled edit profile
  editProfile() {
    this.esEdit = true;
  }
  cancelProfile() {
    this.esEdit = false;
    this.previewUrl = this.cacheUrl;
    this.buildProfile();
  }

  modifyUser(f: NgForm) {
    this.esEdit = false;
    if (this.foto != null) {
      const reader = new FileReader();
      const fileByteArray: any = [];
      reader.readAsArrayBuffer(this.foto);
      reader.onload = (evt) => {
        const arrayBuffer = <ArrayBuffer>reader.result;
        const array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < array.length; i++) {
          fileByteArray.push(array[i]);
        }
        this.user.foto = [];
        this.user.foto = fileByteArray;
        this.saveUser(f);
      }

      
    } else {
      this.saveUser(f);
    }
  }

  saveUser(f: NgForm) {

    //aplico los cambios 
    this.saveChangeData();
    //guardo en la DB
    this.admsrv.editUser(this.user).subscribe(
      resu => {
        this.logsrv.setUser(resu);
        this.utiser.alertOK('Perfil editado con exito');
      }, error => {
        console.log('Hubo error');
        console.log(error);
        this.utiser.alertError('Error al intentar editar el perfil');
      }
    );
  }

  processFile(event: any) {
    this.foto = event.target.files[0];
    this.preview();
  }

  preview() {
    let reader = new FileReader();
    if (this.foto !== undefined) {
      this.cacheUrl = this.previewUrl;
      reader.readAsDataURL(this.foto);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;

      };
    }
  }

  //modal change pass
  openChangePass(content:any) {
    this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: false, centered: true }).result.then((result) => {
      
    }, (reason) => {
      
    });
  }
  // verific status pass
  verificStatus(event:HTMLInputElement){
    console.log("verific");
    if (this.formPass.controls.pass.value == this.formPass.controls.conf.value ) {
      this.statusPass = true;
    }else{
      this.statusPass = false;
    }
  }

  //save pass changed
  savePass(f:NgForm){
    if (this.formPass.valid && this.statusPass) {
      this.user.password = this.formPass.controls.pass.value;
      console.log(this.user);
      this.admsrv.changePassword(this.user).subscribe(
        resu => {
          this.logsrv.setUser(resu);
          this.user.password = resu.password;
          this.utiser.alertOK('Contraseña cambiada');
          this.modalService.dismissAll();
        }, error => {
          console.log('Hubo error');
          console.log(error);
          this.utiser.alertError('Error al intentar cambiar la contraseña');
        }
      );
    }else{
      Swal.fire("Error","Verifique las contraseñas","warning")
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: reason`;
    }
  }

}
