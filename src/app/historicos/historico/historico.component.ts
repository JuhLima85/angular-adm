import { Component, OnInit } from '@angular/core';
import { PessoaDto } from 'src/app/model/PessoaDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {

  pessoa: PessoaDto;
  relacionamentos: any[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const nav = history.state;
    this.pessoa = nav.pessoa;               
    this.relacionamentos = nav.relacionamentos;    
  }
 
  voltarParaListagem() {
    this.router.navigate(['/clientes/lista']);
  }
}

