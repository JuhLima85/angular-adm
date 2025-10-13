import { Injectable } from '@angular/core';

import { Cliente } from "../pages/clientes/cliente"
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../pages/login/usuario';
import { Pessoa } from '../model/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  
  usuario: Usuario;  
  apiUrl: string = environment.apiUrlBase + '/pessoas'

  constructor( private http: HttpClient) {  }  
  
  salvar(pessoa: Pessoa): Observable<Cliente> {   
    console.log('Entrou no service'); 
    return this.http.post<Cliente>(`${this.apiUrl}`, pessoa);
  }
  
  atualizar(cliente: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}/${cliente.id}`, cliente);
  }   

  listarTodas() : Observable<Pessoa[]> {   
    return this.http.get<Pessoa[]>(this.apiUrl);
  }
 
  buscarPessoaPorId(id: number) : Observable<Pessoa> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }  

  deletar(cliente: Cliente) : Observable<any> {
    return this.http.delete<Cliente>(`${this.apiUrl}/${cliente.id}`);
  }
  
}
 