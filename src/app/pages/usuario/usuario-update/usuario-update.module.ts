import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from '../usuario-routing.module';
import { UsuarioUpdateComponent } from './usuario-update.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsuarioUpdateComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
  ],
  exports: [UsuarioRoutingModule]
})

export class UsuarioUpdateModule { }
