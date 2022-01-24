import { ReactiveFormsModule } from '@angular/forms';
import { FormRoutingModule } from './../../pages/form/form-routing.modules';
import { AppsModule } from './../../pages/apps/apps.module';
import { IconsModule } from './../../pages/icons/icons.module';
import { TablesModule } from './../../pages/tables/tables.module';
import { FormModule } from './../../pages/form/form.module';
import { AdvancedModule } from './../../pages/advanced/advanced.module';
import { UtilityModule } from './../../pages/utility/utility.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { OpusUsersRoutingModule } from './opus-users-routing.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RoleDataComponent } from './pages/role-data/role-data.component';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { UsersListComponent } from './pages/users-list/users-list.component';

import { UsersService } from './services/users.service';
import { PrimengModule } from '../commons/primeng/primeng.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { DropdownModule, MultiSelectModule } from 'primeng-lts';
import { Select2Module } from 'ng-select2-component';
import { ColorIconAccessPipe } from './pipe/color-icon-access.pipe';
import { OperatorsComponent } from './pages/operators/operators.component';
import { OperatorDataComponent } from './pages/operator-data/operator-data.component';
import { DirectiveModule } from 'src/app/shared/directives/directive.module';
import { PermisosComponent } from './pages/permisos/permisos.component';







@NgModule({
  declarations: [
    ChangePasswordComponent,
    PerfilComponent,
    RoleDataComponent,
    RolesListComponent,
    UserDataComponent,
    UsersListComponent,
    PermisosComponent,
    ColorIconAccessPipe,
    OperatorsComponent,
    OperatorDataComponent
    
    
  ],
  imports: [
    CommonModule,
    OpusUsersRoutingModule,
    SharedModule,
    UtilityModule,
    AdvancedModule,
    FormRoutingModule,
    ReactiveFormsModule,
    FormModule,
    TablesModule,
    IconsModule,
    AppsModule,
    PrimengModule,
    DataTablesModule,
    NgbDropdownModule,
    MultiSelectModule,
    DropdownModule,
    Select2Module,
    DirectiveModule
    
  ],
  providers:[UsersService]
})
export class OpusUsersModule { }
