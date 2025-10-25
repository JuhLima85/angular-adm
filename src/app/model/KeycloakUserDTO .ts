export class KeycloakUserDTO {
    id!: string;
    username!: string;
    email!: string;
    firstName!: string;
    lastName!: string;
    enabled: boolean = true;
    password!: string;
    roles: string[] = [];
    roleSelecionado?: string;
  }
  