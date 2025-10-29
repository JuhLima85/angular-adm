import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioLogado: any;   
  isSidebarVisible: boolean = true; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.usuarioLogado = await this.authService.getUsuarioAutenticado();   
  }

  logout(){
    this.authService.encerrarSessao();
    this.router.navigate(['/login'])
  }
 
  hideSidebar(): void {
    this.isSidebarVisible = false;
}
}
