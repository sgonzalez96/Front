import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UtilesService } from '../../../commons/utiles.service';
import { Rol } from '../../models/rol';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-role-data',
  templateUrl: './role-data.component.html',
  styleUrls: ['./role-data.component.scss']
})
export class RoleDataComponent implements OnInit {

  public formDataRoles: FormGroup;

  rol: Rol = new Rol();
  rolId = 0;
  esalta = true;
  public titulo = '';
  public submitted: boolean=false;

  constructor(
    private ususer: UsersService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utiser: UtilesService,
    private _formBuilder: FormBuilder) {
    //this.pageSettings.pageWithFooter = true;

    this.formDataRoles = this._formBuilder.group({
      description:['', Validators.required],
      rolAdm:['']
    })
  }

  
  public get f() {
    return this.formDataRoles.controls; 
  }

  //build data rol
  rolBuild(){
    this.rol.descripcion = this.f.description.value;
    this.rol.rolAdm = this.f.rolAdm.value;
  }
  

  ngOnInit(): void {
    Swal.showLoading();
    this.getParam();
  }

  getParam() {
    
    this.activeRoute.paramMap
    .subscribe(params => {
      if (params.has("id")) {
        let id= params.get("id") ;
        if (id != null) {
          this.rolId= parseInt(id);
        }
      }
    }
    );

    if (this.rolId === 0) {
      this.cargoDefectos();
      Swal.close();
      this.esalta = true;
      this.titulo = 'Alta de rol';
    } else {
      this.cargoRol();
      this.esalta = false;
      this.titulo = 'Edición de rol';
    }

  }

  cargoDefectos() {
    this.rol = new Rol();
  }

  cargoRol() {
    this.ususer.findRolById(this.rolId).subscribe(
      resu => {
        if (resu == null) {
          Swal.close();
          this.utiser.alertError('Rol no encontrado');
          this.router.navigate(['/user/roles-list']);
        } else {
          Swal.close();
          this.rol = resu;
          this.f.description.setValue(resu.descripcion);
          this.f.rolAdm.setValue(resu.rolAdm);
        }
      }, error => {
        Swal.close();
        this.utiser.alertError('Rol no encontrado');
        this.router.navigate(['/user/roles-list']);
      }
    );
  }

  confirmo(f: NgForm) {
    this.submitted = true;
    this.rolBuild();
    
    if (!this.formDataRoles.invalid) {
      this.ususer.saveRol(this.rol).subscribe(
        resu => {
          if (this.esalta) {
            this.utiser.alertOK('Rol creado con éxito');
            this.cargoDefectos();
          } else {
            this.utiser.alertOK('Rol modificado con éxito');
          }
        }, error => {
          if (this.esalta) {
            this.utiser.alertError('Error al intentar crear el rol');
          } else {
            this.utiser.alertError('Error al intentar modificar el rol');
          }
        }
      );
    } else {
      this.utiser.alertWarning('Existen errores en los datos del formulario');
    }
  }

  volver() {
    this.router.navigate(['/user/roles-list']);
  }
}
