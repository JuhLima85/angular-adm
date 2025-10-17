export const environment = {
  production: false,
  apiUrlBase: 'http://localhost:8080',  
  authBypass: true,         // <- quando true, ignora senha real << liga o bypass no DEV
  preferBackend: false,     // <- quando true, usa backend real  para autenticação de login   
  devUser: 'dev',
  devPass: '123456',
  devPerfil: 'ADMIN'  
};