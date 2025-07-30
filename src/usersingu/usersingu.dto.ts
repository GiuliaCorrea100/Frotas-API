export class UserSinguDto {
  idPessoa?: number;
  senha: string;
  nome: string;
  email: string;
  login: string;
}

export interface FindAllParameters {
  nome: string;
}
