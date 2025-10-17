import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { PessoaListaComponent } from './pessoa-lista/pessoa-lista.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from 'src/app/auth.guard'; 

const routes: Routes = [
  {path : 'pessoa', component: LayoutComponent, canActivate:[AuthGuard], children:[
    { path: 'form' , component: PessoaFormComponent },
    { path: 'form/:id' , component: PessoaFormComponent },
    { path: 'lista', component: PessoaListaComponent },
    { path: '', redirectTo : '/pessoa/lista', pathMatch: 'full'}
  ]}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaRoutingModule { } 
