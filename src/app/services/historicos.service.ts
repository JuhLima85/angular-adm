import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
import { Usuario } from '../login/usuario';
import { HistoricoDto } from '../model/HistoricoDto';

@Injectable({
  providedIn: 'root'
})
export class HistoricosService {

  usuario: Usuario;  
  apiUrl: string = environment.apiUrlBase + '/formulario'
  apiUrlRelacionamento: string = environment.apiUrlBase + '/relacionamento'  

  constructor( private http: HttpClient) {  } 

  listarPessasERelacionamentos(id: number): Observable<HistoricoDto> {
    return this.http.get<HistoricoDto>(`${this.apiUrlRelacionamento}/historico/${id}`);
  }  
}
