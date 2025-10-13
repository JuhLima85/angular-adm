import { Parentesco } from "./Parentescos";

export class Pessoa {
    id?: number;
    nome: string = '';
    fone: string = '';
    email: string = '';
    dataNascimento: string = '';
    dataInicioMembresia: string = '';     
    dataCadastro: string = '';
    cep: string = '';
    logradouro: string = '';    
    localidade: string = '';
    bairro: string = '';
    uf: string = '';
    membro: boolean;
  
    parentescos: Parentesco[] = []; 
  
    constructor(init?: Partial<Pessoa>) {
      Object.assign(this, init);
    }
  }