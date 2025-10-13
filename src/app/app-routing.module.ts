import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component'; 
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent}, 
  {path: '', component: LayoutComponent, children:[
    { path:'home', component: HomeComponent, canActivate : [AuthGuard] },   
    { path: '', redirectTo: '/home', pathMatch: 'full' } // qndo acessar a url raiz será redirecionado para a pg home
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }