import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of,  throwError} from 'rxjs';
import { Usuario } from '../login/usuario';
import { Updatedto } from '../login/update-credenciais/update-dto'
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  
  apiURL: string = environment.apiUrlBase + "/api/auth"   
  jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient  
  ) { }

  private base64(obj: any): string {
    // encode sem padding/urlsafe simplificado pro navegador
    return btoa(JSON.stringify(obj));
  }

  private gerarJwtFake(sub: string, userId: number, perfil: string): string {
    const header = { alg: 'none', typ: 'JWT' };
    const now = Math.floor(Date.now()/1000);
    const payload = {
      sub, userId, perfil,
      iat: now,
      exp: now + (60 * 60 * 8) // 8h
    };
    // assinatura vazia (não verificamos assinatura no front)
    return `${this.base64(header)}.${this.base64(payload)}.`;
  }

  obterToken(){
    const tokenString = localStorage.getItem('token')    
    if(tokenString){      
      return tokenString;
    }
    return null;
  }

  encerrarSessao(){
    localStorage.removeItem('token') 
  }
  
  getUsuarioAutenticado(){
    const token = this.obterToken();
    if(token){
      const decodedToken: any = jwtDecode(token);     
      return {        
        idUsuario: decodedToken.userId,
        nomeUsuario: decodedToken.sub,
        perfil: decodedToken.perfil 
      };
    }    
    return null;
  }

  isAutenticado() : boolean {
    const token = this.obterToken();
    if(token){
      const isExpirado = this.jwtHelperService.isTokenExpired(token)
      return !isExpirado;
    }
    return false;
  }  

  registrar(usuario: Usuario): Observable<any> {     
    return this.http.post<any>(`${this.apiURL}/register`, usuario)   
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {             
          return throwError(errorResponse); 
        })
      );
  }

  atualizar(dadosAtualizacao: Updatedto): Observable<any> {        
    return this.http.put<any>(`${this.apiURL}/update`, dadosAtualizacao)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {          
          return throwError(errorResponse);
        })
      );
  }  

  /*login(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/login`, usuario)
      .pipe(
        map(response => {
          const token = response.token;
          if (!token) {
            console.error('Token não encontrado na resposta da API.');
          } else {            
            localStorage.setItem('token', token);
          }
          return response;
        })
      );
  } */
  /*login(usuario: any): Observable<any> {
    // BYPASS DE DEV
    if (environment.authBypass) {
      const okUser = usuario?.login === environment.devUser;
      const okPass = usuario?.password === environment.devPass;

      if (!okUser || !okPass) {
        // mantém o mesmo fluxo de erro do back
        return throwError(() => ({ status: 401, error: { message: 'Credenciais inválidas (DEV)' } }));
      }

      const token = this.gerarJwtFake(environment.devUser, 1, environment.devPerfil);
      localStorage.setItem('token', token);
      return of({ token, devBypass: true });
    }

    // FLUXO NORMAL (produção)
    return this.http.post<any>(`${this.apiURL}/login`, usuario)
      .pipe(
        map(response => {
          const token = response?.token;
          if (!token) {
            console.error('Token não encontrado na resposta da API.');
          } else {
            localStorage.setItem('token', token);
          }
          return response;
        })
      );
  }*/
  login(usuario: any): Observable<any> {
    const usarBackend = environment.preferBackend === true;
    const permitirBypass = environment.authBypass === true;
  
    // 1) Tenta backend real
    if (usarBackend) {
      return this.http.post<any>(`${this.apiURL}/login`, usuario).pipe(
        map(response => {
          const token = response?.token;
          if (token) localStorage.setItem('token', token);
          return response;
        }),
        // 2) Se backend falhar e bypass estiver ligado (apenas DEV), cai no fake
        catchError(err => {
          if (permitirBypass) {
            const okUser = usuario?.login === (environment as any).devUser ?? 'dev';
            const okPass = usuario?.password === (environment as any).devPass ?? '123456';
            if (!okUser || !okPass) return throwError(() => err); // mantém erro real
            const token = this.gerarJwtFake(
              (environment as any).devUser ?? 'dev',
              100,
              (environment as any).devPerfil ?? 'ADMIN'
            );
            localStorage.setItem('token', token);
            return of({ token, devBypass: true, fallbackFromBackend: true });
          }
          return throwError(() => err);
        })
      );
    }
  
    // 3) Se preferBackend = false: usa só bypass (para desenvolvimento rápido)
    if (permitirBypass) {
      const okUser = usuario?.login === (environment as any).devUser ?? 'dev';
      const okPass = usuario?.password === (environment as any).devPass ?? '123456';
      if (!okUser || !okPass) {
        return throwError(() => ({ status: 401, error: { message: 'Credenciais inválidas (DEV)' } }));
      }
      const token = this.gerarJwtFake(
        (environment as any).devUser ?? 'dev',
        100,
        (environment as any).devPerfil ?? 'ADMIN'
      );
      localStorage.setItem('token', token);
      return of({ token, devBypass: true });
    }
  
    // 4) fallback final (sem bypass e sem preferBackend): força backend
    return this.http.post<any>(`${this.apiURL}/login`, usuario).pipe(
      map(response => {
        const token = response?.token;
        if (token) localStorage.setItem('token', token);
        return response;
      })
    );
  }
   
}