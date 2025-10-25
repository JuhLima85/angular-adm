import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../pages/usuario/usuario';
import { Pessoa } from '../model/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  
  usuario: Usuario;  
  apiUrl: string = environment.apiUrlBase + '/pessoas'

  constructor( private http: HttpClient) {  }  
  
  salvar(pessoa: Pessoa): Observable<Pessoa> {       
    return this.http.post<Pessoa>(`${this.apiUrl}`, pessoa);
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

  deletar(pessoa: Pessoa) : Observable<any> {
    return this.http.delete<Pessoa>(`${this.apiUrl}/${pessoa.id}`);
  }  
}
 