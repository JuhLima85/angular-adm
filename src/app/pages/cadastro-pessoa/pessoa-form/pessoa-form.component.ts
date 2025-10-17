import { Component, OnInit } from '@angular/core';

import { PessoaService } from  'src/app/services/pessoa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pessoa } from 'src/app/model/Pessoa'; 

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css']
})
export class PessoaFormComponent implements OnInit {

  pessoa: Pessoa;
  sucesso: boolean = false;
  erros: String[];
  id: number;

  constructor(
    private service: PessoaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { 
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
            this.pessoa = new Pessoa();
          }
        });
      }
    });
  }

  voltarParaListagem() {
    this.router.navigate(['/pessoa/lista'])
  }

  onSubmit() {
    if (this.id) {
      this.service
        .atualizar(this.pessoa)
        .subscribe(response => {
          this.sucesso = true;
          this.erros = null;
        }, erroResponse => {
          this.erros = ['Erro ao atualizar o pessoa.']
        })

    } else {
      this.service.salvar(this.pessoa).subscribe({
        next: (response) => {
          this.sucesso = true;
          this.erros = null;
          this.pessoa = response;
        },
        error: (errorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this.erros = [errorResponse.error.message];
          } else {
            this.erros = ['Erro ao salvar o pessoa.'];
          }
          this.sucesso = false;
        }
      });
    }
  }

  formatarTelefone() {
    if (this.pessoa.fone) {
      let telefoneSemMascara = this.pessoa.fone.replace(/\D/g, '');

      if (telefoneSemMascara.length <= 2) {
        this.pessoa.fone = telefoneSemMascara;
      } else if (telefoneSemMascara.length <= 6) {
        this.pessoa.fone = `(${telefoneSemMascara.substring(0, 2)}) ${telefoneSemMascara.substring(2)}`;
      } else {
        this.pessoa.fone = `(${telefoneSemMascara.substring(0, 2)}) ${telefoneSemMascara.substring(2, 6)}-${telefoneSemMascara.substring(6)}`;
      }
    }
  }
}
