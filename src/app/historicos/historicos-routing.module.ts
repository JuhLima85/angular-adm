import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { HistoricoComponent } from'src/app/historicos/historico/historico.component';

const routes: Routes = [
  { 
    path: 'historicos', 
    component: LayoutComponent, 
    children: [
      { path: 'visualizar-historico', component: HistoricoComponent },
      { path: '', redirectTo: 'visualizar-historico', pathMatch: 'full' } 
    ]
  }      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricosRoutingModule { }
