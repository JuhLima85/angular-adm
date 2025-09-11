import { Component, OnInit } from '@angular/core';
import { Cliente} from '../cliente';
import { ClientesService } from '../../services/clientes.service';
import { Router } from '@angular/router';
import { ClienteServicoDtoService } from 'src/app/services/cliente-servico-dto.service';
import { HistoricosService } from 'src/app/services/historicos.service';
import { Pessoa } from 'src/app/model/Pessoa';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = [];
  pessoas: Pessoa[] = [];
  clienteSelecionado: Cliente;
  mensagemSucesso: string;
  mensagemErro: string;
  
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
        console.log('Pessoa carregada pelo ID:', resposta);
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
        this.mensagemSucesso = 'Cliente deletado com sucesso!'
        this.ngOnInit();
                  },
      erro => this.mensagemErro = 'Ocorreu um erro ao deletar o cliente.')
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
}
