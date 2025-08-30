import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './usuario';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  usuario: Usuario; 
  perfis: string[]; 
  cadastrando: boolean = false;  
  mensagemSucesso: string;
  errors: string[];
  loading = false;
  
   // opcional: exibir aviso no template quando bypass estiver ligado
   readonly devBypassLigado = environment.authBypass === true;

 /* constructor(
    private router : Router,
    private authService:  AuthService
  ) {
    this.usuario = new Usuario();
    this.perfis = ["USER", "ADMIN"]     
   }*/
   constructor(
    private router: Router,
    private authService: AuthService
  ) {
      // 1) garanta que usuario existe ANTES de setar campos
      this.usuario = new Usuario();

    // se quiser facilitar testes em DEV, pré-preenche:
    if (environment.authBypass) {
      // @ts-ignore - ajuste conforme o seu modelo Usuario
      this.usuario.login = (environment as any).devUser ?? 'dev';
      // @ts-ignore
      this.usuario.password = (environment as any).devPass ?? '123456';
      // @ts-ignore
      this.usuario.role = (environment as any).devPerfil ?? 'ADMIN';
    }

     // se você usa this.perfis aqui também:
    this.perfis = ['USER', 'ADMIN'];
  }


  onSubmit(){
    if (this.loading) return; // evita duplo submit
    this.mensagemSucesso = null;
    this.errors = [];
    this.loading = true;
  
    this.login(); 
  }

  /*retornarAoPortofolio() {    
    const url = 'https://codedeving.netlify.app/';
    window.open(url);
  }*/
  retornarAoPortofolio(): void {
    const url = 'https://codedeving.netlify.app/';
    window.open(url, '_blank', 'noopener,noreferrer');
  }

 /* exibirformCadastro(event){    
    this.mensagemSucesso = '';
    this.errors = null;
    event.preventDefault();
    const link = event.target;  
    this.cadastrando = true;          
  }*/
  exibirformCadastro(event: Event): void {
    event.preventDefault();
    this.mensagemSucesso = '';
    this.errors = [];
    this.cadastrando = true;
  }

  /*cancelarCadastro(event){
    event.preventDefault();
    this.cadastrando = false;    
  }*/
  cancelarCadastro(event: Event): void {
    event.preventDefault();
    this.cadastrando = false;
  }

  /*registrar() {      
  this.authService.registrar(this.usuario)    
      .subscribe(
        response => {         
          this.mensagemSucesso = "Usuário registrado com sucesso. Efetue o login.";      
          this.cadastrando = false; 
          this.usuario.login = '';
          this.usuario.password = '';
          this.usuario.role = '';         
          this.errors = null;
        },
        errorResponse => {                   
          this.mensagemSucesso = null;           
          this.errors = errorResponse.error.errors;               
        }
      );
  }*/
  registrar(): void {
    if (this.loading) return;

    this.mensagemSucesso = null;
    this.errors = [];
    this.loading = true;

    this.authService.registrar(this.usuario)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Usuário registrado com sucesso. Efetue o login.';
          this.cadastrando = false;

          // limpa campos sensíveis
          this.usuario.login = '';
          this.usuario.password = '';
          this.usuario.role = '';
          this.errors = [];
        },
        error: (errorResponse) => {
          this.mensagemSucesso = null;
          const backendErrors = (errorResponse?.error?.errors as string[]) || [];
          this.errors = backendErrors.length ? backendErrors : ['Erro ao registrar usuário.'];
        }
      });
  }
  
  /*login() {  
    this.authService.login(this.usuario).subscribe(
      response => {          
        if (localStorage.getItem('token')) {               
          this.router.navigate(['/home']);
        }
      },
      errorResponse => {        
        this.mensagemSucesso = null; 
        this.errors = ['Usuário e/ou senha incorreto(s).'];
      }
    );
  } */ 
  private login(): void {
    this.authService.login(this.usuario)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          const token = localStorage.getItem('token');
          if (token) {
            this.router.navigate(['/home']);
          } else {
            this.errors = ['Falha ao iniciar sessão: token ausente.'];
          }
        },
        error: (err) => {
          const backendErrors = (err?.error?.errors as string[]) || [];
          if (backendErrors.length) {
            this.errors = backendErrors;
          } else if (err?.status === 401) {
            this.errors = ['Usuário e/ou senha incorreto(s).'];
          } else {
            this.errors = ['Erro ao efetuar login. Tente novamente.'];
          }
        }
      });
  
}
}
