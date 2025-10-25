import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioModalComponent } from 'src/app/shared/component/relatorio-modal/relatorio-modal.component';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { KeycloakUserDTO } from 'src/app/model/KeycloakUserDTO ';
import { AuthService } from './../../../services/auth.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  @ViewChild('modalDelecao') modalDelecao!: ElementRef;
  @ViewChild(RelatorioModalComponent) modal!: RelatorioModalComponent;
  usuarios: KeycloakUserDTO[] = [];
  usuarioSelecionado: KeycloakUserDTO;
  mensagemSucesso: string;
  mensagemErro: string;  
  usuarioLogado: string = '';
  modalInstance: any; 
  
  constructor(
    private service: UsuarioService,       
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.authService.getUsuarioAutenticado().then(user => {
      this.usuarioLogado = user?.nomeUsuario ?? '';
    });
  
    this.service.listarUsuarios().subscribe({
      next: (resposta) => { this.usuarios = resposta; },
      error: (err) => console.error('Erro ao buscar usuarios:', err)
    });
  }

  abrirModal() {
    this.modal.abrir();
  }

  novoCadastro(){
    this.router.navigate(['/usuario/form'])
  }

  exibirModalDelet(usuario: KeycloakUserDTO) {  
    this.usuarioSelecionado = usuario;
    
    this.modalInstance = new Modal(this.modalDelecao.nativeElement);
    this.modalInstance.show();
  }

  botaoDesabilitado(usuario: KeycloakUserDTO): boolean {   
    // 1️⃣ Não pode excluir o próprio usuário
    if (usuario.username === this.usuarioLogado) return true;
  
    // 2️⃣ Não pode excluir o sibre-admin
    if (usuario.username?.toLowerCase() === 'sibre-admin') return true;
  
    // 3️⃣ (Opcional) Não pode excluir o único admin do sistema
    const totalAdmins = this.usuarios.filter(u => u.roles.includes('admin')).length;
    if (usuario.roles.includes('admin') && totalAdmins === 1) return true;
  
    return false;
  }

  deletarCadastro() {   
    this.service.deletarUsuario(this.usuarioSelecionado.id).subscribe({
      next: (response) => {       
        this.mensagemSucesso = 'Usuário deletado com sucesso!';
        this.ngOnInit();

        // ✅ fecha o modal usando a instância salva
        if (this.modalInstance) this.modalInstance.hide();
      },
      error: (erro) => {      
        this.mensagemErro = 'Ocorreu um erro ao deletar usuário.';
        if (this.modalInstance) this.modalInstance.hide();
      }
    });
  }
}