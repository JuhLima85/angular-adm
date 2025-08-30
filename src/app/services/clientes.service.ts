import { Injectable } from '@angular/core';

import { Cliente } from "../clientes/cliente"
import {ClienteServicoDto} from "../shared/cliente-servico-dto/cliente-servico-dto"
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../login/usuario';
import { Pessoa } from '../clientes/Pessoa';
import { PessoaDto } from '../clientes/PessoaDto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  
  usuario: Usuario;  
  apiUrl: string = environment.apiUrlBase + '/formulario'
  apiUrlServico: string = environment.apiUrlBase + '/api/servicos-prestados'  

  constructor( private http: HttpClient) {  }  
  
  /*salvar(cliente: Cliente): Observable<Cliente> {    
    return this.http.post<Cliente>(`${this.apiUrl}`, cliente);
  }*/
  salvar(pessoa: Pessoa): Observable<Cliente> {    
    return this.http.post<Cliente>(`${this.apiUrl}`, pessoa);
  }
  
  atualizar(cliente: Cliente) : Observable<any> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }
  
  /*buscarClientes() : Observable<Cliente[]> {   
    return this.http.get<Cliente[]>(this.apiUrl);
  }*/
  buscarPessoas() : Observable<PessoaDto[]> {   
    return this.http.get<PessoaDto[]>(this.apiUrl);
  }
 
  buscarClientePorId(id: number) : Observable<Cliente> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  } 

  deletar(cliente: Cliente) : Observable<any> {
    return this.http.delete<Cliente>(`${this.apiUrl}/${cliente.id}`);
  }

  listarClientesEServicos(cliente: any): Observable<ClienteServicoDto[]> {
    return this.http.get<ClienteServicoDto[]>(`${this.apiUrlServico}/${cliente.id}`);
  }  
}
 