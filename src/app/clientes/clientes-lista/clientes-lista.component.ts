import { Component, OnInit } from '@angular/core';
import { Cliente} from '../cliente';
import { ClientesService } from '../../services/clientes.service';
import { Router } from '@angular/router';
import { ClienteServicoDtoService } from 'src/app/services/cliente-servico-dto.service';
import { Pessoa } from './../Pessoa';
import { PessoaDto } from '../PessoaDto';

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
    private router: Router,
    ) { }

  /*ngOnInit(): void {
    this.service
    .buscarPessoas()
    .subscribe( resposta => this.pessoas = resposta);
  }*/
  ngOnInit(): void {
    this.service.buscarPessoas().subscribe({
      next: (resposta) => {
        console.log('buscarPessoas() -> resposta:', resposta);
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
  
  exibirHistorico(cliente: Cliente) {
    this.service.listarClientesEServicos(cliente)
        .subscribe((historicoDeServicos) => {              
            this.clienteServicoDtoService.setHistorico(historicoDeServicos);             
      this.router.navigate(['/cliente-servico-dto/historico']); 
    }, erro => {
      if (erro.status === 403) {      
        this.mesagemErro = 'Apenas perfil ADIM tem permissão para acessar o histórico financeiro. ';
      } else {       
        this.mesagemErro = 'Ocorreu um erro ao carregar o histórico do cliente.';
      }
    });
}
}
