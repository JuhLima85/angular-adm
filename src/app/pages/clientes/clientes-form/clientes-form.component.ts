import { Component, OnInit } from '@angular/core';

import { Cliente } from '../cliente'
import { ClientesService } from 'src/app/services/clientes.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { Pessoa } from 'src/app/model/Pessoa'; 

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  cliente: Cliente;
  pessoa: Pessoa;
  sucesso: boolean = false;
  erros: String[];
  id: number;

  constructor(
    private service: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.cliente = new Cliente();
    this.pessoa = new Pessoa();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      if (this.id) {
        this.service.buscarPessoaPorId(this.id).subscribe({
          next: (response) => {
            console.log('Pessoa carregada pelo ID:', response);
            this.pessoa = response;
          },
          error: (errorResponse) => {
            console.error('Erro ao buscar pessoa:', errorResponse);
            this.cliente = new Cliente();
          }
        });
      }
    });
  }

  voltarParaListagem() {
    this.router.navigate(['/clientes/lista'])
  }
  onSubmit() {
    if (this.id) {
      this.service
        .atualizar(this.pessoa)
        .subscribe(response => {
          this.sucesso = true;
          this.erros = null;
        }, erroResponse => {
          this.erros = ['Erro ao atualizar o cliente.']
        })

    } else {
      this.service.salvar(this.pessoa).subscribe({
        next: (response) => {
          this.sucesso = true;
          this.erros = null;
          this.cliente = response;
        },
        error: (errorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this.erros = [errorResponse.error.message];
          } else {
            this.erros = ['Erro ao salvar o cliente.'];
          }
          this.sucesso = false;
        }
      });
    }
  }

  formatarTelefone() {
    if (this.cliente.telefone) {
      let telefoneSemMascara = this.cliente.telefone.replace(/\D/g, '');

      if (telefoneSemMascara.length <= 2) {
        this.cliente.telefone = telefoneSemMascara;
      } else if (telefoneSemMascara.length <= 6) {
        this.cliente.telefone = `(${telefoneSemMascara.substring(0, 2)}) ${telefoneSemMascara.substring(2)}`;
      } else {
        this.cliente.telefone = `(${telefoneSemMascara.substring(0, 2)}) ${telefoneSemMascara.substring(2, 6)}-${telefoneSemMascara.substring(6)}`;
      }
    }
  }
}
