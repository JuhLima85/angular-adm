import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from 'src/app/auth.guard';
import { UsuarioUpdateComponent } from './usuario-update/usuario-update.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'update', component: UsuarioUpdateComponent },
      { path: 'form', component: UsuarioFormComponent},
      { path: 'list', component: UsuarioListComponent},
      { path: '', redirectTo: '/usuario/update', pathMatch: 'full' }     
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }

