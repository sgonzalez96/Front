
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { UserDataComponent } from './pages/user-data/user-data.component';
import { RoleDataComponent } from './pages/role-data/role-data.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AuthguardService } from '../commons/authguard.service';
import { PermisosComponent } from './pages/permisos/permisos.component';
import { OperatorsComponent } from './pages/operators/operators.component';
import { OperatorDataComponent } from './pages/operator-data/operator-data.component';


const routes: Routes = [

  { path: 'user-list', component: UsersListComponent, canActivate: [AuthguardService]  },
  { path: 'user-data/:id', component: UserDataComponent, data: { title: 'Usuario'}, canActivate: [AuthguardService] },
  { path: 'roles-list', component: RolesListComponent, data: { title: 'Roles'}, canActivate: [AuthguardService] },
  { path: 'role-data/:id', component: RoleDataComponent, data: { title: 'Rol'}, canActivate: [AuthguardService] },
  { path: 'change-pass', component: ChangePasswordComponent, data: { title: 'Cambio de password'}, canActivate: [AuthguardService] },
  { path: 'user-profile', component: PerfilComponent, data: { title: 'Perfil de usuario'}, canActivate: [AuthguardService] },
  { path: 'permisos', component: PermisosComponent, data: { title: 'Permisos de usuario'}, canActivate: [AuthguardService] },
  { path: 'operario', component: OperatorsComponent, canActivate: [AuthguardService]  },
  { path: 'operator-data/:id/:mode', component: OperatorDataComponent, canActivate: [AuthguardService]  },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpusUsersRoutingModule { }
