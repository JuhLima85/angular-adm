import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { KeycloakUserDTO } from 'src/app/model/KeycloakUserDTO ';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-credenciais',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.css']
})
export class UsuarioUpdateComponent {

  usuarioLogado: KeycloakUserDTO; 
  role: string;   
  mensagemSucesso: string;
  errors: string[];
  idUsuarioLogado: string;
  novaSenha: string;

  constructor(   
    private service: UsuarioService,
    private authService: AuthService,
    private router : Router
  ) { 
    this.usuarioLogado = new KeycloakUserDTO();   
  }

  async ngOnInit(): Promise<void> {      
    await this.authService.getUsuarioAutenticado().then(user => {
      if (user) {
        this.usuarioLogado.id = user.idUsuario;
        this.usuarioLogado.username = user.nomeUsuario;
        this.usuarioLogado.firstName = user.firstName;
        this.usuarioLogado.lastName = user.lastName;
        this.usuarioLogado.email = user.email;
        this.usuarioLogado.roles = user.roles;
        this.idUsuarioLogado = user.idUsuario;
      }
    });    
  }
   
  onSubmit(){   
    this.atualizar();    
  }
  
  cancelarCadastro(event){
    event.preventDefault();       
    this.router.navigate(['/home']); 
  }  

  atualizar() {
    this.usuarioLogado.password = this.novaSenha;  
    this.service.atualizarUsuario(this.idUsuarioLogado, this.usuarioLogado).subscribe(      
      (response) => {               
        this.authService.encerrarSessao();
        this.router.navigate(['/login']);         
      },
      (errorResponse) => {          
        this.mensagemSucesso = null;   
        this.errors = errorResponse.error.errors;  
      }
    );
  }   
}
