import { Component, OnInit } from '@angular/core';
import { Cliente} from '../cliente';
import { ClientesService } from '../../services/clientes.service';
import { Router } from '@angular/router';
import { ClienteServicoDtoService } from 'src/app/services/cliente-servico-dto.service';
import { PessoaDto } from '../../model/PessoaDto';
import { HistoricosService } from 'src/app/services/historicos.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = [];
  pessoas: PessoaDto[] = [];
  clienteSelecionado: Cliente;
  mesagemSucesso: string;
  mesagemErro: string;
  
  constructor(
    private service: ClientesService,
    private clienteServicoDtoService: ClienteServicoDtoService,
    private historicoService: HistoricosService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.service.buscarPessoas().subscribe({
      next: (resposta) => {        
        this.pessoas = resposta;
      },
      error: (err) => console.error('Erro ao buscar pessoas:', err)
    });
  }

  novoCadastro(){
    this.router.navigate(['/clientes/form'])
  }

  exibirClienteModalDelet(cliente: Cliente){
    this.clienteSelecionado = cliente;
  }

  deletarCliente(){
    this.service
    .deletar(this.clienteSelecionado)
    .subscribe(
      response => {
        this.mesagemSucesso = 'Cliente deletado com sucesso!'
        this.ngOnInit();
                  },
      erro => this.mesagemErro = 'Ocorreu um erro ao deletar o cliente.')
  }  

carregarHistorico(id: number): void { 
  this.historicoService.listarPessasERelacionamentos(id).subscribe({
    next: (historico) => {      
      this.router.navigate(['/historicos/visualizar-historico'], {
        state: {
          pessoa: historico.cadastro,         
          relacionamentos: historico.relacionamentos
        }
      });      
      this.mesagemErro = null; 
    },
    error: () => {
      this.mesagemErro = 'Ocorreu um erro ao carregar o histórico.';
      this.mesagemSucesso = null; 
    }
  });
}
}
