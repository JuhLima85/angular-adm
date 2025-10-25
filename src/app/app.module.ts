import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './pages/home/home.component'
import { PessoaModule } from './pages/cadastro-pessoa/pessoa.module'
import { PessoaService} from './services/pessoa.service';
import { UsuarioFormComponent } from './pages/usuario/usuario-form/usuario-form.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './token.interceptor';
import { UsuarioRoutingModule } from './pages/usuario/usuario-routing.module';
import { UsuarioUpdateModule } from './pages/usuario/usuario-update/usuario-update.module';
import { HistoricosService } from 'src/app/services/historicos.service';
import { HistoricosModule } from './pages/historicos/historicos.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './shared/config/keycloak-init';
import { UsuarioListComponent } from './pages/usuario/usuario-list/usuario-list.component';

//app.module.ts
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsuarioFormComponent,
    LayoutComponent,
    UsuarioListComponent
  ],
  imports: [ 
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TemplateModule, 
    PessoaModule,
    FormsModule,        
    UsuarioRoutingModule,
    UsuarioUpdateModule,
    HistoricosModule,
    KeycloakAngularModule           
  ],
  providers: [    
    PessoaService,        
    AuthService,
    HistoricosService,  
    {     
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, 
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
