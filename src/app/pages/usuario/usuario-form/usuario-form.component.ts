import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { KeycloakUserDTO } from 'src/app/model/KeycloakUserDTO ';

@Component({
  selector: 'app-login',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {
 
  usuario: KeycloakUserDTO; 
  perfis: string[]; 
  cadastrando: boolean = true;  
  mensagemSucesso: string;
  errors: string[];
  loading = false;  

  usuarioLogado: any;   
  
   readonly devBypassLigado = environment.authBypass === true;
 
   constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.usuario = new KeycloakUserDTO();
    this.perfis = ['ADMIN', 'GESTOR', 'CONSULTA']; 
    this.mensagemSucesso = '';
    this.errors = [];
  }   

  onSubmit(){
    if (this.loading) return;
    this.mensagemSucesso = null;
    this.errors = [];
    this.loading = true;     
  }

  exibirformCadastro(event: Event): void {
    event.preventDefault();
    this.mensagemSucesso = '';
    this.errors = [];
    this.cadastrando = true;
  }
  
  cancelarCadastro(event: Event): void {
    event.preventDefault();
    this.cadastrando = false;
    this.router.navigate(['/usuario/list']);
  }
  
  registrar(): void {
    if (this.loading) return;
  
    this.mensagemSucesso = null;
    this.errors = [];
    this.loading = true;
  
    this.usuario.roles = this.usuario.roleSelecionado
    ? [this.usuario.roleSelecionado.toLowerCase()]
    : [];
  
    this.usuarioService.criarUsuario(this.usuario)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (resposta) => {
          this.mensagemSucesso = (resposta as any)?.message || 'Usuário criado com sucesso!';
          this.cadastrando = false;
          this.usuario = new KeycloakUserDTO();
        },
        error: (errorResponse) => {        
          let mensagemApi: string | null = null;
        
          try {
            // Se o backend mandou um JSON em formato de string, tenta converter
            if (typeof errorResponse.error === 'string') {
              const parsed = JSON.parse(errorResponse.error);
              mensagemApi = parsed.message;
            } else {
              mensagemApi = errorResponse?.error?.message;
            }
          } catch (e) {
            console.warn('Falha ao converter mensagem de erro:', e);
          }
        
          if (mensagemApi) {
            this.errors = [mensagemApi];
          } else if (errorResponse.status === 0) {
            this.errors = ['Não foi possível conectar ao servidor. Verifique sua conexão.'];
          } else {
            this.errors = ['Erro ao registrar usuário. Tente novamente mais tarde.'];
          }
        }        
      });
  }    
}

