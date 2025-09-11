import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pessoa } from 'src/app/model/Pessoa';
import { ClientesService } from 'src/app/services/clientes.service';
import { HistoricosService } from 'src/app/services/historicos.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent implements OnInit {

  pessoa: Pessoa;
  relacionamentos: any[];
  pessoasDisponiveis: Pessoa[] = [];   // lista de todos os membros
  idFamiliar?: number;
  tipoParentesco: string = '';

  constructor(
    private router: Router,
    private historicoService: HistoricosService,
    private clientesService: ClientesService  // 👈 serviço que lista todas as pessoas
  ) {}
  

  ngOnInit(): void {
    const nav = history.state;
    this.pessoa = nav.pessoa;

    this.listarTodos();      
    this.carregarRelacionamentos(); 
  }

  adicionarRelacionamento() {
    const id1 = this.pessoa.id;
    const id2 = this.idFamiliar;
    const tipo = this.tipoParentesco;

    if (!id1 || !id2 || !tipo) {
      console.error("Preencha todos os campos para criar o vínculo.");
      return;
    }

    this.historicoService.criarVinculo(id1, id2, tipo).subscribe({
      next: (pessoaAtualizada) => {
        console.log("Relacionamento criado!", pessoaAtualizada);
        this.pessoa = pessoaAtualizada; // atualiza a tela
        this.idFamiliar = undefined;
        this.tipoParentesco = '';
      },
      error: (err) => {
        console.error("Erro ao criar relacionamento:", err);
      }
    });
  }

  listarTodos() {
    this.clientesService.buscarPessoas().subscribe({
      next: (resposta) => {
        // remove a própria pessoa do dropdown
        this.pessoasDisponiveis = resposta.filter(p => p.id !== this.pessoa.id);
  
        console.log('Pessoas disponíveis (sem a própria):', this.pessoasDisponiveis);
      },
      error: (err) => console.error('Erro ao buscar pessoas:', err)
    });
  }
  
  carregarRelacionamentos() {
    if (!this.pessoa?.id) return;
  
    this.historicoService.buscarRelacionamentos(this.pessoa.id).subscribe({
      next: (resposta) => {
        this.relacionamentos = resposta;
        console.log('Relacionamentos carregados:', this.relacionamentos);
      },
      error: (err) => console.error('Erro ao buscar relacionamentos:', err)
    });
  }
    
  voltarParaListagem() {
    this.router.navigate(['/clientes/lista']);
  }  
  
}

