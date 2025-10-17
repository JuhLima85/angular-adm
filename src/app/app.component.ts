import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sibre-adm'; 

  usuario: any;

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    this.usuario = await this.auth.getUsuarioAutenticado();    
  }
}
