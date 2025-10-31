import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,  Router} from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { 

  constructor(
    private authService: AuthService,
    private router: Router
  ){ }

  /*async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const autenticado = await this.authService.isAutenticado();
  
    if (!autenticado) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const rolesNecessarias = route.data['roles'] as string[];
    if (rolesNecessarias && !rolesNecessarias.some(r => this.authService.hasRole(r))) {
      this.router.navigate(['/acesso-negado']);
      return false;
    }
  
    return true;
  }*/
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // 🔹 Verifica se está autenticado
    const autenticado = await this.authService.isAutenticado();

    if (!autenticado) {
      this.router.navigate(['/login']);
      return false;
    }

    // 🔹 Recupera as roles exigidas pela rota
    const rolesNecessarias = route.data['roles'] as string[];

    // 🔹 Se a rota não exigir roles específicas → libera
    if (!rolesNecessarias || rolesNecessarias.length === 0) {
      return true;
    }

    // 🔹 Pega todas as roles do usuário logado
    const userRoles = this.authService.getRoles?.() || [];
    console.log(`🔐 Verificando acesso — usuário com roles: [${userRoles}] tentando acessar rota restrita a [${rolesNecessarias}]`);

    // ✅ Verifica se o usuário tem pelo menos uma das roles permitidas
    const possuiPermissao = userRoles.some(role =>
      rolesNecessarias.map(r => r.toLowerCase()).includes(role.toLowerCase())
    );

    if (possuiPermissao) {
      return true;
    }

    // 🚫 Caso não tenha permissão, redireciona
    console.warn(`🚫 Acesso negado — usuário com roles: [${userRoles}] tentou acessar rota restrita a [${rolesNecessarias}]`);
    this.router.navigate(['/acesso-negado']);
    return false;
  }
}