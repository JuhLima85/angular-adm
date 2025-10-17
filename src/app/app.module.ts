import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './pages/home/home.component'
import { PessoaModule } from './pages/cadastro-pessoa/pessoa.module'
import { PessoaService} from './services/pessoa.service';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './token.interceptor';
import { CredenciaisRoutingModule } from './pages/login/update-credenciais/credenciais-routing.module'
import { CredenciaisModule } from './pages/login/update-credenciais/credenciais.module'; 
import { HistoricosService } from 'src/app/services/historicos.service';
import { HistoricosModule } from './pages/historicos/historicos.module';

//app.module.ts
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent     
  ],
  imports: [   
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TemplateModule, 
    PessoaModule,
    FormsModule,        
    CredenciaisRoutingModule,
    CredenciaisModule,
    HistoricosModule           
  ],
  providers: [    
    PessoaService,        
    AuthService,
    HistoricosService,  
    {     
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
