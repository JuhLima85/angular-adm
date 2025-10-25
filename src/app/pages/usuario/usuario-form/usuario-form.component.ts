import { Component, OnInit } from '@angular/core';
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

  async ngOnInit(): Promise<void> {  
    console.log('Usuário logado:', this.usuarioLogado);
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
  
    this.usuario.roles = [this.usuario.roleSelecionado!.toLowerCase()];
    this.usuarioService.criarUsuario(this.usuario)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (resposta) => {
          this.mensagemSucesso = resposta || 'Usuário criado com sucesso!';
          this.cadastrando = false;
          this.usuario = new KeycloakUserDTO();
        },
        error: (errorResponse) => {
          console.error('Erro ao criar usuário:', errorResponse);
        
          if (errorResponse.status === 409) {
            this.errors = ['Já existe um usuário com este e-mail ou nome de usuário.'];
          } else if (errorResponse.error?.message) {
            this.errors = [errorResponse.error.message];
          } else {
            this.errors = ['Erro ao registrar usuário. Tente novamente mais tarde.'];
          }
        }
      });
  }    
}

