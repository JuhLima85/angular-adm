import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { UsuarioFormComponent } from './pages/usuario/usuario-form/usuario-form.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: '', component: LayoutComponent, children:[
    { path:'home', component: HomeComponent, canActivate : [AuthGuard] },         
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }