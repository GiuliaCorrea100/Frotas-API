export class UserSinguDto {
  idUsuarioSingu?: number;
  idPessoaSingu: number;
  senha: string;
  nome: string;
  email: string;
  login: string;
}

export interface FindAllParameters {
  nome: string;
}
