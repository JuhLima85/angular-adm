export class Pessoa {
    id_c?: number;
    nome: string = '';
    fone: string = '';
    email: string = '';
    data: string = '';        // dd/MM/yyyy (ou ISO se preferir)
    cep: string = '';
    logradouro: string = '';
    bairro: string = '';
    localidade: string = '';
    uf: string = '';
    membro: boolean;
  
    //relacionamentosPessoa1: Relacionamento[] = [];
    //relacionamentosPessoa2: Relacionamento[] = [];
  
    constructor(init?: Partial<Pessoa>) {
      Object.assign(this, init);
    }
  }