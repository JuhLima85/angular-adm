import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PessoaRoutingModule } from './pessoa-routing.module';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { PessoaListaComponent } from './pessoa-lista/pessoa-lista.component';
import { RelatorioModalComponent } from 'src/app/shared/component/relatorio-modal/relatorio-modal.component';


// pessoa.module.ts
@NgModule({
  declarations: [
    PessoaFormComponent,
    PessoaListaComponent,
    RelatorioModalComponent    
  ],
  imports: [
  CommonModule,
  PessoaRoutingModule,
   FormsModule,   
   
  ], exports: [
    PessoaFormComponent,
    PessoaListaComponent
  ]
})
export class PessoaModule { } 
