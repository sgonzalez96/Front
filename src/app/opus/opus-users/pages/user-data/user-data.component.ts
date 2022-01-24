import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import { UtilesService } from '../../../commons/utiles.service';
import { Rol } from '../../models/rol';
import { Usuario } from '../../models/usuario';
import { UsersService } from '../../services/users.service';

class SelectedRol {
  rol: Rol | undefined;
  selected: boolean = false;
}

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {

  //data form
  public formDataUser: FormGroup;
  public previewUrl: any = null;
  public cacheUrl: any = null;

  user = new Usuario();
  roles: Rol[] = [];
  selectedRols: SelectedRol[] = [];

  userId = 0;
  esalta = true;
  titulo = '';
  dobleauth = true;
  public submitted: boolean = false;

  constructor(
    private ususer: UsersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utiser: UtilesService,
    private _fromBuilder: FormBuilder
  ) {
    this.formDataUser = _fromBuilder.group({
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      email: [''],
      address: [''],
      phone: [''],
      doubleAuth: [''],
     
    });

    //this.pageSettings.pageWithFooter = true;
  }


  //get info form 
  get f() { return this.formDataUser.controls; }

  // to make user build 
  userBuild() {
    this.user.userName = this.f.username.value;
    this.user.nombreCompleto = this.f.fullname.value;
    this.user.email = this.f.email.value;
    this.user.direccion = this.f.address.value;
    this.user.telefono = this.f.phone.value;
    this.user.dobleAuth = this.f.doubleAuth.value;



  }
  // to load user's data to edit 
  dataUserToEdit(user: Usuario) {
    this.f.username.setValue(user.userName);
    this.f.fullname.setValue(user.nombreCompleto);
    this.f.email.setValue(user.email);
    this.f.address.setValue(user.direccion);
    this.f.phone.setValue(user.telefono);
    this.f.doubleAuth.setValue(user.dobleAuth);
    
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.getParam();
  }

  getParam() {
    this.activeRoute.paramMap
      .subscribe(params => {
        if (params.has("id")) {
          let id = params.get("id");
          if (id != null) {
            this.userId = parseInt(id);
          }
        }
        console.log(params);

        console.log(this.userId);
      }
      );

    if (this.userId === 0) {
      this.cargoDefectos();
      this.esalta = true;
      this.titulo = 'Alta de usuario';
    } else {
      this.cargoUsuario();
      this.esalta = false;
      this.titulo = 'Edición de usuario';
    }


  }

  cargoDefectos() {
    this.user = new Usuario();
    this.getUserRols();
  }

  //caladores -------------------------------------------------------------------
  processFile(event: any) {
    this.f.caladorImg.setValue(event.target.files[0]);
    this.preview();

    const reader = new FileReader();
    const fileByteArray: any = [];
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = (evt) => {
      const arrayBuffer = <ArrayBuffer>reader.result;
      const array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < array.length; i++) {
        fileByteArray.push(array[i]);
      }
      this.f.caladorImg.setValue(fileByteArray);
    }
  }

  preview() {
    let reader = new FileReader();
    if (this.f.caladorImg.value !== undefined) {
      this.cacheUrl = this.previewUrl;
      reader.readAsDataURL(this.f.caladorImg.value);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;

      };
    }
  }
  // check calador false, clean data calador
  resetCaladorData(event: any) {
    if (event.srcElement.value) {
      this.f.caladorReg.setValue(null);
      this.f.caladorImg.setValue(null);
      this.cacheUrl = null;
      this.previewUrl = null;
    }

  }
  // ------------------------------------------------------------------------------

  cargoUsuario() {
    this.ususer.findUserById(this.userId).subscribe(
      resu => {
        if (resu == null) {
          this.utiser.alertError('Usuario no encontrado');
          this.router.navigate(['/user/user-list']);
        } else {
          this.user = resu;
          console.log(this.user);
          this.dataUserToEdit(this.user);
          this.getUserRols();
        }
      }, error => {
        this.utiser.alertError('Usuario no encontrado');
        this.router.navigate(['/user/user-list']);
      }
    );
  }

  getUserRols() {
    this.selectedRols = [];
    this.ususer.findAllRols().subscribe(
      resu => {
        this.roles = resu;

        for (const rol of this.roles) {
          const role = new SelectedRol();
          role.rol = rol;
          role.selected = false;
          if (this.user.roles != null && this.user.roles != undefined) {
            for (const userRole of this.user.roles) {
              if (userRole.idRol === rol.idRol) {
                role.selected = true;
              }
            }
          }
          this.selectedRols.push(role);


        } Swal.close();
      }
    );
  }

  confirmo(f: NgForm) {
    this.submitted = true;
    this.userBuild();
    if (!this.formDataUser.invalid) {
      const roless: Rol[] = [];
      for (let rr of this.selectedRols) {
        if (rr.selected) {
          if (rr.rol !== undefined) {
            roless.push(rr.rol);
          }
        }
      }

      this.user.roles = roless;
      console.log(this.user);
     
        if (this.esalta) {
          this.save("C");
        } else {
          this.save("E");
        }
      
      
    } else {
      this.utiser.alertWarning('Existen errores en los datos del formulario');
    }
  }


  save(arg: string) {
    switch (arg) {
      case "C":
        this.user.pais = 'UY';
        this.ususer.createUser(this.user).subscribe(
          resu => {
            this.utiser.alertOK('Usuario creado con éxito');
            this.volver();
          }, error => {
            this.utiser.alertError('Error al intentar crear el usuario');
          }
        );
        break;
      case "E":
        this.ususer.editUser(this.user).subscribe(
          resu => {
            this.utiser.alertOK('Usuario modificado con éxito');
            this.volver();
          }, error => {
            this.utiser.alertError('Error al intentar modificar el usuario');
          }
        );
        break;

      default:
        break;
    }

  }

 

  volver() {
    this.router.navigate(['/user/user-list']);
  }

  //verifico los roles marcados 
  selectRols(source: any, index: number) {

    for (let i = 0; i < this.selectedRols.length; i++) {
      this.selectedRols[i].selected = false;

    }

    if (source.srcElement.checked) {
      this.selectedRols[index].selected = true
    }
  }


}
