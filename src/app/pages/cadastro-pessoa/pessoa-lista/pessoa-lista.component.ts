import { Component, OnInit } from '@angular/core';
import { PessoaService } from 'src/app/services/pessoa.service'; 
import { Router } from '@angular/router';
import { HistoricosService } from 'src/app/services/historicos.service';
import { Pessoa } from 'src/app/model/Pessoa';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { RelatorioModalComponent } from 'src/app/shared/component/relatorio-modal/relatorio-modal.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-pessoa-lista',
  templateUrl: './pessoa-lista.component.html',
  styleUrls: ['./pessoa-lista.component.css']
})
export class PessoaListaComponent implements OnInit {
  @ViewChild(RelatorioModalComponent) modal!: RelatorioModalComponent;
  pessoas: Pessoa[] = [];
  pessoaSelecionada: Pessoa;
  mensagemSucesso: string;
  mensagemErro: string;  
  
  constructor(
    private service: PessoaService,    
    private relatorioService: RelatorioService,
    private historicoService: HistoricosService,    
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.service.listarTodas().subscribe({
      next: (resposta) => {        
        this.pessoas = resposta;        
      },
      error: (err) => console.error('Erro ao buscar pessoas:', err)
    });
  }

  abrirModal() {
    this.modal.abrir();
  }

  novoCadastro(){
    this.router.navigate(['/pessoa/form'])
  }

  exibirModalDelet(pessoa: Pessoa){
    this.pessoaSelecionada = pessoa;
  }

  deletarCadastro(){
    this.service
    .deletar(this.pessoaSelecionada)
    .subscribe(
      response => {
        this.mensagemSucesso = 'Cadastro deletado com sucesso!'
        this.ngOnInit();
                  },
      erro => this.mensagemErro = 'Ocorreu um erro ao deletar cadastro.')
  }  

carregarHistorico(id: number): void { 
  this.service.buscarPessoaPorId(id).subscribe({
    next: (pessoa) => {      
      this.router.navigate(['/historicos/visualizar-historico'], {
        state: {
          pessoa: pessoa               
        }
      });      
      this.mensagemErro = null; 
    },
    error: () => {
      this.mensagemErro = 'Ocorreu um erro ao carregar o histórico.';
      this.mensagemSucesso = null; 
    }
  });
}

gerarPdf(): void {
  this.relatorioService.gerarRelatorioPessoas(this.pessoas);
}

gerarRelatorio(tipo: string) {
  let pessoasFiltradas = this.pessoas;

  if (tipo === 'membros') {
    pessoasFiltradas = this.pessoas.filter(p => p.membro);
  } else if (tipo === 'naoMembros') {
    pessoasFiltradas = this.pessoas.filter(p => !p.membro);
  }

  this.relatorioService.gerarRelatorioPessoas(pessoasFiltradas);
}
}
