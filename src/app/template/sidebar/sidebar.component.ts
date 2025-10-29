import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { APP_NAME, APP_VERSION } from 'src/app/shared/config/version';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  usuarioLogado: any;   
  isSidebarVisible: boolean = true; 
  appName = APP_NAME;
  appVersion = APP_VERSION;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuarioAutenticado();
  }

  logout(){
    this.authService.encerrarSessao();
    this.router.navigate(['/login'])
  }
 
  hideSidebar(): void {
    this.isSidebarVisible = false;
}
}
