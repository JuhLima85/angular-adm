import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakUserDTO } from '../model/KeycloakUserDTO ';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.apiUrlBase}/usuarios`;

  constructor(private http: HttpClient) {}

  criarUsuario(usuario: KeycloakUserDTO): Observable<string> {
    return this.http.post(this.apiUrl, usuario, { responseType: 'text' });
  }

  atualizarUsuario(id: string, usuario: KeycloakUserDTO): Observable<string> {    
    return this.http.put(`${this.apiUrl}/${id}`, usuario, { responseType: 'text' });
  }

  listarUsuarios(): Observable<KeycloakUserDTO[]> {
    return this.http.get<KeycloakUserDTO[]>(this.apiUrl);
  }

  deletarUsuario(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
